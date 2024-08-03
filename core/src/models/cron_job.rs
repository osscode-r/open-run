use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct CronJob {
    pub id: Uuid,
    pub schedule: String,
    pub command: String,
    pub description: Option<String>,
    pub name: String,
    pub bash_script: Option<String>,
    pub user_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub is_active: bool,
    pub last_run_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateCronJobRequest {
    pub schedule: String,
    pub command: String,
    pub description: Option<String>,
    pub name: String,
    pub bash_script: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateCronJobRequest {
    pub schedule: String,
    pub command: String,
    pub description: Option<String>,
    pub name: String,
    pub bash_script: Option<String>,
    pub is_active: bool,
}

#[derive(Debug, Deserialize)]
pub struct DeleteCronJobRequest {
    pub id: String,
}

#[derive(Debug, Serialize)]
pub struct CronJobResponse {
    pub success: bool,
    pub message: String,
    pub data: Option<CronJob>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CronJobListResponse {
    pub success: bool,
    pub message: String,
    pub data: Option<Vec<CronJob>>,
}