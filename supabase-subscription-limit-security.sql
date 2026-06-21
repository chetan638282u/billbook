-- BillBook subscription limit security fix
-- Run this once in Supabase SQL Editor for the live project.
-- It enforces plan limits in the database, so limits cannot be bypassed
-- by calling Supabase directly from outside the app UI.

CREATE OR REPLACE FUNCTION get_effective_plan(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_plan TEXT;
  v_valid_until TIMESTAMPTZ;
BEGIN
  SELECT plan, valid_until
  INTO v_plan, v_valid_until
  FROM subscriptions
  WHERE user_id = p_user_id;

  IF v_plan IN ('starter', 'pro') AND v_valid_until > NOW() THEN
    RETURN v_plan;
  END IF;

  RETURN 'free';
END;
$$;

CREATE OR REPLACE FUNCTION enforce_client_plan_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_plan TEXT;
  v_limit INTEGER;
  v_count INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('clients'), hashtext(NEW.user_id::TEXT));

  v_plan := get_effective_plan(NEW.user_id);
  v_limit := CASE v_plan
    WHEN 'free' THEN 3
    WHEN 'starter' THEN 10
    ELSE NULL
  END;

  IF v_limit IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*)
  INTO v_count
  FROM clients
  WHERE user_id = NEW.user_id;

  IF v_count >= v_limit THEN
    RAISE EXCEPTION 'client_limit_reached'
      USING ERRCODE = 'P0001',
            DETAIL = format('Your %s plan allows %s clients.', v_plan, v_limit);
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION enforce_invoice_plan_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_plan TEXT;
  v_limit INTEGER;
  v_count INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('invoices'), hashtext(NEW.user_id::TEXT));

  v_plan := get_effective_plan(NEW.user_id);
  v_limit := CASE v_plan
    WHEN 'free' THEN 5
    ELSE NULL
  END;

  IF v_limit IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*)
  INTO v_count
  FROM invoices
  WHERE user_id = NEW.user_id
    AND created_at >= date_trunc('month', NOW());

  IF v_count >= v_limit THEN
    RAISE EXCEPTION 'invoice_limit_reached'
      USING ERRCODE = 'P0001',
            DETAIL = format('Your %s plan allows %s invoices per month.', v_plan, v_limit);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_client_plan_limit_trigger ON clients;
CREATE TRIGGER enforce_client_plan_limit_trigger
  BEFORE INSERT ON clients
  FOR EACH ROW EXECUTE PROCEDURE enforce_client_plan_limit();

DROP TRIGGER IF EXISTS enforce_invoice_plan_limit_trigger ON invoices;
CREATE TRIGGER enforce_invoice_plan_limit_trigger
  BEFORE INSERT ON invoices
  FOR EACH ROW EXECUTE PROCEDURE enforce_invoice_plan_limit();

-- Verification: both trigger names should appear after running this query.
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name IN (
  'enforce_client_plan_limit_trigger',
  'enforce_invoice_plan_limit_trigger'
)
ORDER BY trigger_name;
