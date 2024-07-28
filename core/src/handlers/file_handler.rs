use actix_web::{get, delete, web, HttpResponse, Responder};
use actix_files::NamedFile;
use std::path::PathBuf;
use crate::services::file_service;
use crate::errors::FileManagerError;
use crate::AppState;

use serde::Deserialize;

#[get("/list/all")]
async fn list_files(data: web::Data<AppState>) -> Result<impl Responder, FileManagerError> {
    let config = &data.config;
    let files = file_service::list_files(&config.file_storage_path)?;
    Ok(HttpResponse::Ok().json(files))
}

#[derive(Deserialize)]
struct FilePathQuery {
    file_path: String,
}

#[get("/get")]
async fn list_file_by_id(data: web::Data<AppState>,query: web::Query<FilePathQuery>) -> Result<impl Responder, FileManagerError> {
    let config = &data.config;
    let name = query.file_path.clone();
    let file_path = file_service::get_file_path(&config.file_storage_path, &name)?;
    println!("file_path: {}", file_path);
    let file = file_service::list_files(&file_path)?;
    Ok(HttpResponse::Ok().json(file))
}

#[get("/{file_id}")]
async fn download_file(
   data: web::Data<AppState>,
    file_id: web::Path<String>,
) -> Result<impl Responder, FileManagerError> {
    let config = &data.config;
    let file_path = file_service::get_file_path(&config.file_storage_path, &file_id)?;
    let path: PathBuf = file_path.into();
    Ok(NamedFile::open(path))
}

#[delete("/{file_id}")]
async fn delete_file(
   data: web::Data<AppState>,
    file_id: web::Path<String>,
) -> Result<impl Responder, FileManagerError> {
    let config = &data.config;
    let file_path = file_service::get_file_path(&config.file_storage_path, &file_id)?;
    file_service::delete_file(&file_path)?;
    Ok(HttpResponse::NoContent().finish())
}