use actix_web::{post, get, delete, web, HttpResponse, Responder};
use crate::models::cron_job::{CreateCronJobRequest, CronJobResponse, DeleteCronJobRequest};
use crate::services::cron_job_service;

#[post("/cron")]
pub async fn create_cron_job(info: web::Json<CreateCronJobRequest>) -> impl Responder {
    match cron_job_service::create_cron_job(&info.username, &info.schedule, &info.command).await {
        Ok(_) => HttpResponse::Created().json(CronJobResponse{
            success: true,
            message: "Cron job created successfully".to_string(),
            data: None,
        }),
        Err(e) => HttpResponse::InternalServerError().json(CronJobResponse {
            success: false,
            message: format!("Failed to create cron job: {}", e),
            data: None
        })
    }
}

#[get("/cron/{username}")]
pub async fn list_cron_jobs(path: web::Path<String>) -> impl Responder {
    let username = path.into_inner();
    match cron_job_service::list_cron_jobs(&username).await {
        Ok(jobs) => HttpResponse::Ok().json(CronJobResponse {
            success: true,
            message: "Cron jobs retrieved successfully".to_string(), 
            data: None
        }),
        Err(e) => HttpResponse::InternalServerError().json(CronJobResponse {
            success: false,
            message: format!("Failed to list cron jobs: {}", e),
            data: None
        })
    }
}

#[delete("/cron")]
pub async fn delete_cron_job(info: web::Json<DeleteCronJobRequest>) -> impl Responder {
    match cron_job_service::delete_cron_job(&info.username, info.job_index).await {
        Ok(_) => HttpResponse::Ok().json(CronJobResponse {
            success: true,
            message: "Cron job deleted successfully".to_string(),
            data: None
        }),
        Err(e) => HttpResponse::InternalServerError().json(CronJobResponse {
            success: false,
            message: format!("Failed to delete cron job: {}", e),
            data: None
        })
    }
}
