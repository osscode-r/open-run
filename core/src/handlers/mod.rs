use actix_web::web;
use actix_web_httpauth::middleware::HttpAuthentication;

use crate::middleware;

pub mod file_handler;
pub mod auth_handler;
pub mod cron_job_handler;

pub fn config(cfg: &mut web::ServiceConfig) {
    let auth = HttpAuthentication::bearer(middleware::validator);

    cfg.service(
        web::scope("/api/v1")
            .service(
                web::scope("/files")
                    .wrap(auth.clone())
                    .route("", web::get().to(file_handler::list_files))
                    .route("/{id}", web::get().to(file_handler::list_file_by_id))
                    .route("/{id}/download", web::get().to(file_handler::download_file))
                    .route("/{id}", web::delete().to(file_handler::delete_file))
            )
            .service(
                web::scope("/cron-jobs")
                    .wrap(auth.clone())
                    .route("", web::post().to(cron_job_handler::create_cron_job))
                    .route("", web::get().to(cron_job_handler::list_cron_jobs))
                    .route("/{id}", web::delete().to(cron_job_handler::delete_cron_job))
                    .route("/{id}", web::get().to(cron_job_handler::get_cron_job))
                    .route("/{id}", web::put().to(cron_job_handler::update_cron_job))
            )
            .service(
                web::scope("/auth")
                    .service(auth_handler::login)
                    .service(auth_handler::signup)
            )
    );
}