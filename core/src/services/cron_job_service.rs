use log::info;
use log::error;
use sqlx::PgPool;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use std::fs::File;
use std::fs::OpenOptions;
use std::process::Command;
use crate::models::cron_job::{CronJob, CreateCronJobRequest, UpdateCronJobRequest};
use crate::repository::cron_repository;
use std::path::Path;
use std::io::{Write, Error as IoError};

const LOG_DIR: &str = "/var/log/cron_jobs";

pub async fn create_cron_job(pool: &PgPool, mut job: CreateCronJobRequest, user_id: Uuid) -> Result<CronJob, Box<dyn std::error::Error>> {
    job.schedule = job.schedule.trim().replace(['\'', '"'], "");
    
    info!("Attempting to create cron job with schedule: {}", job.schedule);

    info!("Cron schedule '{}' is valid", job.schedule);

    let cron_job = cron_repository::create_cron_job(pool, job, user_id).await?;
    
    info!("Cron job created in database: {:?}", cron_job);

    let log_file_path = format!("{}/{}.log", LOG_DIR, cron_job.id);
    File::create(&log_file_path)?;

    add_to_crontab(&cron_job,&log_file_path)?;

    info!("Cron job successfully created and added to crontab");
    Ok(cron_job)
}

pub async fn list_cron_jobs(pool: &PgPool, user_id: Uuid) -> Result<Vec<CronJob>, sqlx::Error> {
    cron_repository::list_cron_jobs(pool, user_id).await
}

pub async fn get_cron_job_by_id(pool: &PgPool, id: Uuid, user_id: Uuid) -> Result<CronJob, sqlx::Error> {
    cron_repository::get_cron_job_by_id(pool, id, user_id).await
}

pub async fn update_cron_job(pool: &PgPool, id: Uuid, job: UpdateCronJobRequest, user_id: Uuid) -> Result<CronJob, Box<dyn std::error::Error>> {
    let updated_job = cron_repository::update_cron_job(pool, id, job, user_id).await?;
    let log_file_path = format!("{}/{}.log", LOG_DIR, updated_job.id);
    File::create(&log_file_path)?;
    info!("Updating log file path: {}", log_file_path);
    update_in_crontab(&updated_job,&log_file_path)?;

    Ok(updated_job)
}

pub async fn delete_cron_job(pool: &PgPool, id: Uuid, user_id: Uuid) -> Result<(), Box<dyn std::error::Error>> {
    let job = cron_repository::get_cron_job_by_id(pool, id, user_id).await?;
    cron_repository::delete_cron_job(pool, id, user_id).await?;

    remove_from_crontab(&job)?;

    Ok(())
}


fn add_to_crontab(job: &CronJob, log_file_path: &str) -> Result<(), Box<dyn std::error::Error>> {
    info!("Adding job to crontab: {:?}", job);

    if !Path::new(log_file_path).exists() {
        info!("Log file does not exist. Creating: {}", log_file_path);
        let mut file = OpenOptions::new()
            .write(true)
            .create(true)
            .open(log_file_path)?;
        writeln!(file, "Log file created for Job ID: {}", job.id)?;
    }
        
    let escaped_command = job.command.replace("'", "'\\''").replace("\"", "\\\"");
    let cron_entry = format!(
        "{} /usr/bin/env bash -c 'echo \"[$(date -u '+\\%Y-\\%m-\\%dT\\%H:\\%M:\\%SZ')] Job started\" >> {} && {} >> {} 2>&1 && echo \"[$(date -u '+\\%Y-\\%m-\\%dT\\%H:\\%M:\\%SZ')] Job executed successfully\" >> {} || echo \"[$(date -u '+\\%Y-\\%m-\\%dT\\%H:\\%M:\\%SZ')] Job failed with status $?\" >> {}' # Job ID: {}",
        job.schedule, log_file_path, escaped_command, log_file_path, log_file_path, log_file_path, job.id
    );
    
    info!("Cron entry: {}", cron_entry);

    let output = Command::new("sh")
        .arg("-c")
        .arg(format!("(crontab -l 2>/dev/null; echo '{}') | crontab -", cron_entry.replace("'", "'\\''")))
        .output()?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        error!("Failed to add job to crontab: {}", stderr);
        return Err(format!("Failed to add job to crontab: {}", stderr).into());
    }

    info!("Job added to crontab successfully");

    Ok(())
}


fn update_in_crontab(job: &CronJob, log_file_path: &str) -> Result<(), Box<dyn std::error::Error>> {
    remove_from_crontab(job)?;
    if job.is_active {
        add_to_crontab(job,log_file_path)?;
    }else{
        info!("Cron job is inactive. Skipping adding to crontab: {:?}", job);
    }

    Ok(())
}

fn remove_from_crontab(job: &CronJob) -> Result<(), Box<dyn std::error::Error>> {
    info!("Deleting job from crontab: {:?}", job);

    let output = Command::new("sh")
        .arg("-c")
        .arg(format!("crontab -l | grep -v \"# Job ID: {}\" | crontab -", job.id))
        .output()?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        error!("Failed to delete job from crontab: {}", stderr);
        return Err(format!("Failed to delete job from crontab: {}", stderr).into());
    }

    info!("Job deleted from crontab successfully");

    Ok(())
}

pub fn get_last_run_time(job_id: Uuid) -> Result<Option<DateTime<Utc>>, Box<dyn std::error::Error>> {
    info!("Getting last run time for job: {}", job_id);
    
    let log_file_path = format!("{}/{}.log", LOG_DIR, job_id);
    info!("Log file path: {}", log_file_path);
    
    if !Path::new(&log_file_path).exists() {
        info!("Log file not found: {}", log_file_path);
        return Ok(None);
    }
    
    let log_content = std::fs::read_to_string(log_file_path)?;
    
    let last_execution_line = log_content.lines()
        .rev()
        .find(|line| line.contains("Job executed successfully") || line.contains("Job failed"));
    
        if let Some(line) = last_execution_line {
            info!("Last execution line: {}", line);
            
            let datetime_str = line.trim_start_matches('[')
                .split(']')
                .next()
                .unwrap_or("")
                .trim();
            
            match DateTime::parse_from_rfc3339(datetime_str) {
                Ok(datetime) => {
                    let utc_datetime: DateTime<Utc> = datetime.with_timezone(&Utc);
                    info!("Last execution time: {}", utc_datetime);
                    Ok(Some(utc_datetime))
                },
                Err(e) => {
                    info!("Failed to parse datetime: {}. Error: {}", datetime_str, e);
                    Err(e.into())
                }
            }
        } else {
            info!("Last execution line not found in log file");
            Ok(None)
        }
}

pub async fn get_job_status(pool: &PgPool, job_id: Uuid, user_id: Uuid) -> Result<(CronJob, String), Box<dyn std::error::Error>> {
    let job = cron_repository::get_cron_job_by_id(pool, job_id, user_id).await?;
    
    let log_file_path = format!("{}/{}.log", LOG_DIR, job_id);
    let log_content = std::fs::read_to_string(log_file_path)?;

    Ok((job, log_content))
}

// pub async fn update_last_run(pool: &PgPool, id: Uuid) -> Result<(), sqlx::Error> {
//     cron_repository::update_last_run(pool, id).await
// }

// pub async fn get_due_jobs(pool: &PgPool) -> Result<Vec<CronJob>, sqlx::Error> {
//     let jobs = cron_repository::list_all_active_jobs(pool).await?;
//     let now = Utc::now();
    
//     Ok(jobs.into_iter().filter(|job| {
//         if let Ok(schedule) = Schedule::from_str(&job.schedule) {
//             let next_run = job.last_run_at
//                 .map(|last_run| schedule.after(&last_run).next())
//                 .unwrap_or_else(|| schedule.upcoming(Utc).next());
            
//             if let Some(next_run) = next_run {
//                 next_run <= now
//             } else {
//                 false
//             }
//         } else {
//             false
//         }
//     }).collect())
// }

// pub async fn execute_job(pool: &PgPool, job: &CronJob) -> Result<(), Box<dyn std::error::Error>> {
//     let output = Command::new("sh")
//         .arg("-c")
//         .arg(&job.command)
//         .output()?;

//     if output.status.success() {
//         println!("Job {} executed successfully", job.id);
//         println!("Output: {}", String::from_utf8_lossy(&output.stdout));
//     } else {
//         eprintln!("Job {} failed", job.id);
//         eprintln!("Error: {}", String::from_utf8_lossy(&output.stderr));
//     }

//     update_last_run(pool, job.id).await?;

//     Ok(())
// }

// pub async fn start_job_scheduler(pool: PgPool) {
//     loop {
//         match get_due_jobs(&pool).await {
//             Ok(jobs) => {
//                 for job in jobs {
//                     if let Err(e) = execute_job(&pool, &job).await {
//                         eprintln!("Failed to execute job {}: {}", job.id, e);
//                     }
//                 }
//             }
//             Err(e) => eprintln!("Failed to get due jobs: {}", e),
//         }

//         sleep(Duration::from_secs(60)).await;
//     }
// }