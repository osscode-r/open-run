use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct CronJob {
    pub schedule: String,
    pub command: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateCronJobRequest {
    pub username: String,
    pub schedule: String,
    pub command: String,
}

#[derive(Debug, Deserialize)]
pub struct DeleteCronJobRequest {
    pub username: String,
    pub job_index: usize,
}

#[derive(Debug, Serialize)]
pub struct CronJobResponse {
    pub success: bool,
    pub message: String,
    pub data: Option<CronJob>,
}