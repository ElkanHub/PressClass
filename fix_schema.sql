-- 1. Fix 'title' column (was likely 'topic' in older versions)
DO $$
BEGIN
  -- If 'topic' exists but 'title' does not, rename it
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='notes' and column_name='topic') 
     AND NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='notes' and column_name='title')
  THEN
      ALTER TABLE "public"."notes" RENAME COLUMN "topic" TO "title";
  
  -- If 'title' does not exist (and no 'topic' to rename), add it
  ELSIF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='notes' and column_name='title')
  THEN
      ALTER TABLE "public"."notes" ADD COLUMN "title" text;
  END IF;
END $$;

-- 2. Fix 'school' column (was likely 'school_name')
DO $$
BEGIN
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='notes' and column_name='school_name')
     AND NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='notes' and column_name='school')
  THEN
      ALTER TABLE "public"."notes" RENAME COLUMN "school_name" TO "school";
  ELSIF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='notes' and column_name='school')
  THEN
      ALTER TABLE "public"."notes" ADD COLUMN "school" text;
  END IF;
END $$;

-- 3. Ensure other potentially missing columns exist
DO $$
BEGIN
    -- sub_strand
    IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='notes' and column_name='sub_strand') THEN
        ALTER TABLE "public"."notes" ADD COLUMN "sub_strand" text;
    END IF;

    -- date (ensure it exists, type change is harder in a simple script if data exists, but let's assume it's missing or correct)
    IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='notes' and column_name='date') THEN
        ALTER TABLE "public"."notes" ADD COLUMN "date" date;
    END IF;

    -- duration
    IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='notes' and column_name='duration') THEN
        ALTER TABLE "public"."notes" ADD COLUMN "duration" text;
    END IF;

    -- week_term
    IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='notes' and column_name='week_term') THEN
        ALTER TABLE "public"."notes" ADD COLUMN "week_term" text;
    END IF;
END $$;

-- 4. Reload schema cache to ensure PostgREST picks up the changes
NOTIFY pgrst, 'reload schema';
