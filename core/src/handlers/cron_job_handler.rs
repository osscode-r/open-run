use actix_web::{web, HttpResponse, Responder};
use crate::models::cron_job::{CreateCronJobRequest, UpdateCronJobRequest, CronJobResponse, CronJobListResponse};
use crate::services::cron_job_service;
use crate::{AppState, TokenClaims};
use uuid::Uuid;

pub async fn create_cron_job(
    data: web::Data<AppState>,
    job: web::Json<CreateCronJobRequest>,
    claims: web::ReqData<TokenClaims>,
) -> impl Responder {
    let user_id = claims.sub;
    match cron_job_service::create_cron_job(&data.db, job.0, user_id).await {
        Ok(job) => HttpResponse::Created().json(CronJobResponse {
            success: true,
            message: "Cron job created successfully".to_string(),
            data: Some(job),
        }),
        Err(e) => HttpResponse::InternalServerError().json(CronJobResponse {
            success: false,
            message: format!("Failed to create cron job: {}", e),
            data: None
        })
    }
}

pub async fn list_cron_jobs(
    data: web::Data<AppState>,
    claims: web::ReqData<TokenClaims>,
) -> impl Responder {
    let user_id = claims.sub;
    match cron_job_service::list_cron_jobs(&data.db, user_id).await {
        Ok(jobs) => HttpResponse::Ok().json(CronJobListResponse {
            success: true,
            message: "Cron jobs retrieved successfully".to_string(),
            data: Some(jobs),
        }),
        Err(e) => HttpResponse::InternalServerError().json(CronJobListResponse {
            success: false,
            message: format!("Failed to list cron jobs: {}", e),
            data: None
        })
    }
}

pub async fn get_cron_job(
    data: web::Data<AppState>,
    path: web::Path<Uuid>,
    claims: web::ReqData<TokenClaims>,
) -> impl Responder {
    let user_id = claims.sub;
    let id = path.into_inner();
    match cron_job_service::get_cron_job_by_id(&data.db, id, user_id).await {
        Ok(job) => HttpResponse::Ok().json(CronJobResponse {
            success: true,
            message: "Cron job retrieved successfully".to_string(),
            data: Some(job),
        }),
        Err(e) => HttpResponse::InternalServerError().json(CronJobResponse {
            success: false,
            message: format!("Failed to get cron job: {}", e),
            data: None
        })
    }
}

pub async fn update_cron_job(
    data: web::Data<AppState>,
    path: web::Path<Uuid>,
    job: web::Json<UpdateCronJobRequest>,
    claims: web::ReqData<TokenClaims>,
) -> impl Responder {
    let user_id = claims.sub;
    let id = path.into_inner();
    match cron_job_service::update_cron_job(&data.db, id, job.0, user_id).await {
        Ok(job) => HttpResponse::Ok().json(CronJobResponse {
            success: true,
            message: "Cron job updated successfully".to_string(),
            data: Some(job),
        }),
        Err(e) => HttpResponse::InternalServerError().json(CronJobResponse {
            success: false,
            message: format!("Failed to update cron job: {}", e),
            data: None
        })
    }
}

pub async fn delete_cron_job(
    data: web::Data<AppState>,
    path: web::Path<Uuid>,
    claims: web::ReqData<TokenClaims>,
) -> impl Responder {
    let user_id = claims.sub;
    let id = path.into_inner();
    match cron_job_service::delete_cron_job(&data.db, id, user_id).await {
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