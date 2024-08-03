CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE cron_jobs (
    id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    schedule VARCHAR(255) NOT NULL,
    command TEXT NOT NULL,
    description TEXT,
    name VARCHAR(255) NOT NULL,
    bash_script TEXT,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT cron_jobs_name_unique UNIQUE (name),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_cron_jobs_updated_at
    BEFORE UPDATE ON cron_jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TYPE cron_job_status AS ENUM ('Running', 'Stopped', 'Failed', 'Completed');

CREATE TABLE cron_jobs_run (
    id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    cron_job_id UUID NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    finished_at TIMESTAMP WITH TIME ZONE,
    next_run TIMESTAMP WITH TIME ZONE,
    status cron_job_status NOT NULL,
    FOREIGN KEY (cron_job_id) REFERENCES cron_jobs(id)
);

CREATE TABLE cron_job_logs (
    id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    cron_job_run_id UUID NOT NULL,
    log_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    log_level VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    FOREIGN KEY (cron_job_run_id) REFERENCES cron_jobs_run(id)
);

CREATE INDEX idx_cron_job_logs_cron_job_run_id ON cron_job_logs (cron_job_run_id);
CREATE INDEX idx_cron_job_logs_log_time ON cron_job_logs (log_time);