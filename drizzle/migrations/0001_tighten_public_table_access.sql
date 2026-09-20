-- Remove tautological (true) policies and anonymous direct table access.
DROP POLICY IF EXISTS "Reference dataset is publicly readable" ON public.tools_reference;
DROP POLICY IF EXISTS "Anyone may log an anonymous submission" ON public.submissions;

REVOKE ALL ON public.tools_reference FROM anon;
REVOKE ALL ON public.submissions FROM anon;

GRANT ALL ON public.tools_reference TO service_role;
GRANT ALL ON public.submissions TO service_role;

-- Controlled read path for the curated reference dataset (safe columns only).
CREATE OR REPLACE FUNCTION public.get_tools_reference()
RETURNS TABLE (
  tool_name TEXT,
  category TEXT,
  jurisdiction TEXT,
  eu_alternative TEXT,
  risk_weight NUMERIC,
  source_note TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT t.tool_name, t.category, t.jurisdiction, t.eu_alternative, t.risk_weight, t.source_note
  FROM public.tools_reference t
$$;

-- Controlled, validated write path for anonymous scan logging.
CREATE OR REPLACE FUNCTION public.log_submission(_submitted_tools TEXT[], _computed_score INTEGER)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID := gen_random_uuid();
  item TEXT;
BEGIN
  IF _submitted_tools IS NULL OR array_length(_submitted_tools, 1) IS NULL THEN
    RAISE EXCEPTION 'submitted_tools must contain at least one entry';
  END IF;
  IF array_length(_submitted_tools, 1) > 50 THEN
    RAISE EXCEPTION 'submitted_tools may contain at most 50 entries';
  END IF;
  FOREACH item IN ARRAY _submitted_tools LOOP
    IF item IS NULL OR length(btrim(item)) = 0 OR length(item) > 120 THEN
      RAISE EXCEPTION 'each submitted tool must be 1 to 120 characters';
    END IF;
  END LOOP;
  IF _computed_score IS NULL OR _computed_score < 0 OR _computed_score > 100 THEN
    RAISE EXCEPTION 'computed_score must be between 0 and 100';
  END IF;

  INSERT INTO public.submissions (id, submitted_tools, computed_score)
  VALUES (new_id, _submitted_tools, _computed_score);

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.get_tools_reference() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.log_submission(TEXT[], INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_tools_reference() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.log_submission(TEXT[], INTEGER) TO anon, authenticated, service_role;
