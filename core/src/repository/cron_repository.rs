use sqlx::PgPool;
use uuid::Uuid;
use crate::models::cron_job::{CronJob, CreateCronJobRequest, UpdateCronJobRequest};
use crate::services::cron_job_service::get_last_run_time;

pub async fn create_cron_job(pool: &PgPool, job: CreateCronJobRequest, user_id: Uuid) -> Result<CronJob, sqlx::Error> {
    let row = sqlx::query!(
        r#"
        INSERT INTO cron_jobs (schedule, command, description, name, bash_script, user_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, schedule, command, description, name, bash_script, user_id, created_at, updated_at, is_active, last_run_at
        "#,
        job.schedule,
        job.command,
        job.description,
        job.name,
        job.bash_script,
        user_id
    )
    .fetch_one(pool)
    .await?;

    Ok(CronJob {
        id: row.id,
        schedule: row.schedule,
        command: row.command,
        description: row.description,
        name: row.name,
        bash_script: row.bash_script,
        user_id: row.user_id,
        created_at: row.created_at.expect("Created at should always have a value"),
        updated_at: row.updated_at.expect("Updated at should always have a value"),
        is_active: row.is_active,
        last_run_at: row.last_run_at,
    })
}

pub async fn list_cron_jobs(pool: &PgPool, user_id: Uuid) -> Result<Vec<CronJob>, sqlx::Error> {
    let rows = sqlx::query!(
        r#"
        SELECT id, schedule, command, description, name, bash_script, user_id, created_at, updated_at, is_active
        FROM cron_jobs
        WHERE user_id = $1
        "#,
        user_id
    )
    .fetch_all(pool)
    .await?;

    Ok(rows.into_iter().map(|row| {
        let last_run_at = match get_last_run_time(row.id) {
            Ok(Some(time)) => Some(time),
            Ok(None) => None,  
            Err(_) => None, 
        };

        CronJob {
            id: row.id,
            schedule: row.schedule,
            command: row.command,
            description: row.description,
            name: row.name,
            bash_script: row.bash_script,
            user_id: row.user_id,
            created_at: row.created_at.expect("Created at should always have a value"),
            updated_at: row.updated_at.expect("Updated at should always have a value"),
            is_active: row.is_active,
            last_run_at,
        }
    }).collect())
}

pub async fn get_cron_job_by_id(pool: &PgPool, id: Uuid, user_id: Uuid) -> Result<CronJob, sqlx::Error> {
    let row = sqlx::query!(
        r#"
        SELECT id, schedule, command, description, name, bash_script, user_id, created_at, updated_at, is_active, last_run_at
        FROM cron_jobs
        WHERE id = $1 AND user_id = $2
        "#,
        id,
        user_id
    )
    .fetch_one(pool)
    .await?;

    Ok(CronJob {
        id: row.id,
        schedule: row.schedule,
        command: row.command,
        description: row.description,
        name: row.name,
        bash_script: row.bash_script,
        user_id: row.user_id,
        created_at: row.created_at.expect("Created at should always have a value"),
        updated_at: row.updated_at.expect("Updated at should always have a value"),
        is_active: row.is_active,
        last_run_at: row.last_run_at,
    })
}

pub async fn update_cron_job(pool: &PgPool, id: Uuid, job: UpdateCronJobRequest, user_id: Uuid) -> Result<CronJob, sqlx::Error> {
    let row = sqlx::query!(
        r#"
        UPDATE cron_jobs
        SET schedule = $1, command = $2, description = $3, name = $4, bash_script = $5, is_active = $6
        WHERE id = $7 AND user_id = $8
        RETURNING id, schedule, command, description, name, bash_script, user_id, created_at, updated_at, is_active, last_run_at
        "#,
        job.schedule,
        job.command,
        job.description,
        job.name,
        job.bash_script,
        job.is_active,
        id,
        user_id
    )
    .fetch_one(pool)
    .await?;

    Ok(CronJob {
        id: row.id,
        schedule: row.schedule,
        command: row.command,
        description: row.description,
        name: row.name,
        bash_script: row.bash_script,
        user_id: row.user_id,
        created_at: row.created_at.expect("Created at should always have a value"),
        updated_at: row.updated_at.expect("Updated at should always have a value"),
        is_active: row.is_active,
        last_run_at: row.last_run_at,
    })
}

pub async fn delete_cron_job(pool: &PgPool, id: Uuid, user_id: Uuid) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"
        UPDATE cron_jobs
        SET is_active = false
        WHERE id = $1 AND user_id = $2
        "#,
        id,
        user_id
    )
    .execute(pool)
    .await?;

    Ok(())
}

// pub async fn update_last_run(pool: &PgPool, id: Uuid) -> Result<(), sqlx::Error> {
//     sqlx::query!(
//         r#"
//         UPDATE cron_jobs
//         SET last_run_at = NOW()
//         WHERE id = $1
//         "#,
//         id
//     )
//     .execute(pool)
//     .await?;

//     Ok(())
// }

// pub async fn list_all_active_jobs(pool: &PgPool) -> Result<Vec<CronJob>, sqlx::Error> {
//     let rows = sqlx::query!(
//         r#"
//         SELECT id, schedule, command, description, name, bash_script, user_id, created_at, updated_at, is_active, last_run_at
//         FROM cron_jobs
//         WHERE is_active = true
//         "#
//     )
//     .fetch_all(pool)
//     .await?;

//     Ok(rows.into_iter().map(|row| CronJob {
//         id: row.id,
//         schedule: row.schedule,
//         command: row.command,
//         description: row.description,
//         name: row.name,
//         bash_script: row.bash_script,
//         user_id: row.user_id,
//         created_at: row.created_at.expect("Created at should always have a value"),
//         updated_at: row.updated_at.expect("Updated at should always have a value"),
//         is_active: row.is_active,
//         last_run_at: row.last_run_at,
//     }).collect())
// }