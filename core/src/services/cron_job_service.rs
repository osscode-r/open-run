use std::process::Command;
use anyhow::{Result, anyhow};
use crate::models::cron_job::CronJob;

pub async fn create_cron_job(username: &str, schedule: &str, command: &str) -> Result<()> {
    let cron_command = format!("{} {}", schedule, command);
    let output = Command::new("su")
        .arg("-c")
        .arg(format!("(crontab -l 2>/dev/null; echo \"{}\") | crontab -", cron_command))
        .arg(username)
        .output()?;

    if output.status.success() {
        Ok(())
    } else {
        Err(anyhow!("Failed to create cron job: {}", String::from_utf8_lossy(&output.stderr)))
    }
}

pub async fn list_cron_jobs(username: &str) -> Result<Vec<CronJob>> {
    let output = Command::new("su")
        .arg("-c")
        .arg("crontab -l")
        .arg(username)
        .output()?;

    if output.status.success() {
        let cron_output = String::from_utf8_lossy(&output.stdout);
        let jobs: Vec<CronJob> = cron_output
            .lines()
            .filter(|line| !line.trim().is_empty() && !line.trim().starts_with('#'))
            .map(|line| {
                let parts: Vec<&str> = line.splitn(6, ' ').collect();
                let schedule = parts[..5].join(" ");
                let command = parts[5..].join(" ");
                CronJob { schedule, command }
            })
            .collect();
        Ok(jobs)
    } else {
        Err(anyhow!("Failed to list cron jobs: {}", String::from_utf8_lossy(&output.stderr)))
    }
}

pub async fn delete_cron_job(username: &str, job_index: usize) -> Result<()> {
    let temp_file = format!("/tmp/{}_crontab", username);
    let output = Command::new("su")
        .arg("-c")
        .arg(format!("crontab -l > {}", temp_file))
        .arg(username)
        .output()?;

    if !output.status.success() {
        return Err(anyhow!("Failed to retrieve crontab: {}", String::from_utf8_lossy(&output.stderr)));
    }

    let sed_command = format!("sed -i '{}d' {}", job_index + 1, temp_file);
    let output = Command::new("sh")
        .arg("-c")
        .arg(&sed_command)
        .output()?;

    if !output.status.success() {
        return Err(anyhow!("Failed to delete cron job: {}", String::from_utf8_lossy(&output.stderr)));
    }

    let output = Command::new("su")
        .arg("-c")
        .arg(format!("crontab {}", temp_file))
        .arg(username)
        .output()?;

    if output.status.success() {
        Ok(())
    } else {
        Err(anyhow!("Failed to update crontab: {}", String::from_utf8_lossy(&output.stderr)))
    }
}