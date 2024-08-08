use actix_web::web;
use actix_web_httpauth::middleware::HttpAuthentication;

use crate::middleware;

pub mod auth_handler;
pub mod cron_job_handler;
pub mod file_handler;

pub fn config(cfg: &mut web::ServiceConfig) {
    let auth = HttpAuthentication::bearer(middleware::validator);

    cfg.service(
        web::scope("/api/v1")
            .service(
                web::scope("/cron-jobs")
                    .wrap(auth.clone())
                    .route("", web::post().to(cron_job_handler::create_cron_job))
                    .route("", web::get().to(cron_job_handler::list_cron_jobs))
                    .route("/{id}", web::delete().to(cron_job_handler::delete_cron_job))
                    .route("/{id}", web::get().to(cron_job_handler::get_cron_job))
                    .route("/{id}", web::put().to(cron_job_handler::update_cron_job))
                    .route(
                        "/logs/{id}",
                        web::get().to(cron_job_handler::get_cron_job_log_by_id),
                    ),
            )
            .service(
                web::scope("/files")
                    .wrap(auth.clone())
                    .route(
                        "/create-directory",
                        web::post().to(file_handler::create_directory),
                    )
                    .route("/create-file", web::post().to(file_handler::create_file))
                    .route("/delete-file", web::delete().to(file_handler::delete_file))
                    .route(
                        "/delete-directory",
                        web::delete().to(file_handler::delete_directory),
                    )
                    .route(
                        "/create-directory-with-parent",
                        web::post().to(file_handler::create_directory_with_parent),
                    )
                    .route(
                        "/list-files-and-directories-in-path",
                        web::get().to(file_handler::list_files_and_directories_in_path),
                    ),
            )
            .service(
                web::scope("/auth")
                    .service(auth_handler::login)
                    .service(auth_handler::signup),
            ),
    );
}
