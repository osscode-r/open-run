use log::info;
use log::error;
use sqlx::PgPool;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use cron::Schedule;
use std::str::FromStr;
use std::process::Command;
use crate::models::cron_job::{CronJob, CreateCronJobRequest, UpdateCronJobRequest};
use crate::repository::cron_repository;
use tokio::time::{sleep, Duration};

pub async fn create_cron_job(pool: &PgPool, mut job: CreateCronJobRequest, user_id: Uuid) -> Result<CronJob, Box<dyn std::error::Error>> {
    job.schedule = job.schedule.trim().replace(['\'', '"'], "");
    
    info!("Attempting to create cron job with schedule: {}", job.schedule);

    if let Err(e) = Schedule::from_str(&job.schedule) {
        error!("Invalid cron expression '{}': {}", job.schedule, e);
        return Err(format!("Invalid cron expression: {}", e).into());
    }

    info!("Cron schedule '{}' is valid", job.schedule);

    let cron_job = cron_repository::create_cron_job(pool, job, user_id).await?;
    
    info!("Cron job created in database: {:?}", cron_job);

    add_to_crontab(&cron_job)?;

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
    let _schedule = Schedule::from_str(&job.schedule)?;

    let updated_job = cron_repository::update_cron_job(pool, id, job, user_id).await?;

    update_in_crontab(&updated_job)?;

    Ok(updated_job)
}

pub async fn delete_cron_job(pool: &PgPool, id: Uuid, user_id: Uuid) -> Result<(), Box<dyn std::error::Error>> {
    let job = cron_repository::get_cron_job_by_id(pool, id, user_id).await?;
    cron_repository::delete_cron_job(pool, id, user_id).await?;

    remove_from_crontab(&job)?;

    Ok(())
}

pub async fn update_last_run(pool: &PgPool, id: Uuid) -> Result<(), sqlx::Error> {
    cron_repository::update_last_run(pool, id).await
}

pub async fn get_due_jobs(pool: &PgPool) -> Result<Vec<CronJob>, sqlx::Error> {
    let jobs = cron_repository::list_all_active_jobs(pool).await?;
    let now = Utc::now();
    
    Ok(jobs.into_iter().filter(|job| {
        if let Ok(schedule) = Schedule::from_str(&job.schedule) {
            let next_run = job.last_run_at
                .map(|last_run| schedule.after(&last_run).next())
                .unwrap_or_else(|| schedule.upcoming(Utc).next());
            
            if let Some(next_run) = next_run {
                next_run <= now
            } else {
                false
            }
        } else {
            false
        }
    }).collect())
}

pub async fn execute_job(pool: &PgPool, job: &CronJob) -> Result<(), Box<dyn std::error::Error>> {
    let output = Command::new("sh")
        .arg("-c")
        .arg(&job.command)
        .output()?;

    if output.status.success() {
        println!("Job {} executed successfully", job.id);
        println!("Output: {}", String::from_utf8_lossy(&output.stdout));
    } else {
        eprintln!("Job {} failed", job.id);
        eprintln!("Error: {}", String::from_utf8_lossy(&output.stderr));
    }

    update_last_run(pool, job.id).await?;

    Ok(())
}

pub async fn start_job_scheduler(pool: PgPool) {
    loop {
        match get_due_jobs(&pool).await {
            Ok(jobs) => {
                for job in jobs {
                    if let Err(e) = execute_job(&pool, &job).await {
                        eprintln!("Failed to execute job {}: {}", job.id, e);
                    }
                }
            }
            Err(e) => eprintln!("Failed to get due jobs: {}", e),
        }

        sleep(Duration::from_secs(60)).await;
    }
}

fn add_to_crontab(job: &CronJob) -> Result<(), Box<dyn std::error::Error>> {
    let cron_entry = format!("{} {} # Job ID: {}", job.schedule, job.command, job.id);
    
    Command::new("sh")
        .arg("-c")
        .arg(format!("(crontab -l 2>/dev/null; echo \"{}\") | crontab -", cron_entry))
        .output()?;

    Ok(())
}

fn update_in_crontab(job: &CronJob) -> Result<(), Box<dyn std::error::Error>> {
    remove_from_crontab(job)?;
    add_to_crontab(job)?;

    Ok(())
}

fn remove_from_crontab(job: &CronJob) -> Result<(), Box<dyn std::error::Error>> {
    Command::new("sh")
        .arg("-c")
        .arg(format!("crontab -l | grep -v \"# Job ID: {}\" | crontab -", job.id))
        .output()?;

    Ok(())
}