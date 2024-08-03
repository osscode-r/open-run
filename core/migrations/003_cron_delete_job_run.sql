-- Migration: Remove unnecessary cron job tables and elements

-- Drop indexes
DROP INDEX IF EXISTS idx_cron_job_logs_cron_job_run_id;
DROP INDEX IF EXISTS idx_cron_job_logs_log_time;

-- Drop tables
DROP TABLE IF EXISTS cron_job_logs;
DROP TABLE IF EXISTS cron_jobs_run;

-- Drop enum type
DROP TYPE IF EXISTS cron_job_status;

-- Optionally, if you want to keep track of the last run in the cron_jobs table:
ALTER TABLE cron_jobs
ADD COLUMN last_run_at TIMESTAMP WITH TIME ZONE;

-- Update the trigger function to not update last_run_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.last_run_at IS DISTINCT FROM OLD.last_run_at THEN
        RETURN NEW;
    END IF;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';