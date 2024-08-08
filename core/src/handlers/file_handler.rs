use std::path::Path;

use crate::{
    models::file::{CreateDirectoryRequest, CreateDirectoryResponse, DeleteFileRequest, FileListResponse},
    services::file_service,
    AppState, TokenClaims,
};
use actix_web::{web, HttpResponse, Responder};
use log::info;

pub async fn create_directory(
    data: web::Data<AppState>,
    req: web::Json<CreateDirectoryRequest>,
    claims: web::ReqData<TokenClaims>,
) -> impl Responder {
    let req = req.into_inner();
    let path = req.path.clone();
    let name = req.name.clone();
    info!("Creating directory: {} in path: {}", name, path);

    let dir_path = Path::new(&path).join(&name);
    if dir_path.exists() {
        return HttpResponse::Conflict().json(CreateDirectoryResponse {
            success: false,
            message: "Directory already exists".to_string(),
        });
    }
    match file_service::create_directory(&data.db, path, name, claims.sub) {
        Ok(_file) => HttpResponse::Created().json(CreateDirectoryResponse {
            success: true,
            message: "Directory created successfully".to_string(),
        }),
        Err(_e) => HttpResponse::InternalServerError().json(CreateDirectoryResponse {
            success: false,
            message: "Failed to create directory".to_string(),
        }),
    }
}

pub async fn create_file(
    data: web::Data<AppState>,
    req: web::Json<CreateDirectoryRequest>,
    claims: web::ReqData<TokenClaims>,
) -> impl Responder {
    let req = req.into_inner();
    let path = req.path.clone();
    let name = req.name.clone();
    info!("Creating file: {} in path: {}", name, path);

    match file_service::create_file(&data.db, path, name, claims.sub) { 
        Ok(_file) => HttpResponse::Created().json(CreateDirectoryResponse {
            success: true,
            message: "File created successfully".to_string(),
        }),
        Err(_e) => HttpResponse::InternalServerError().json(CreateDirectoryResponse {
            success: false,
            message: "Failed to create file".to_string(),
        }),
    }
}

pub async fn delete_file(
    data: web::Data<AppState>,
    req: web::Json<DeleteFileRequest>,
    claims: web::ReqData<TokenClaims>,
) -> impl Responder {
    let req = req.into_inner();
    let path = req.path.clone();
    info!("Deleting file in path: {}", path);

    match file_service::delete_file(&data.db, path, claims.sub) {
        Ok(_file) => HttpResponse::Ok().json(CreateDirectoryResponse {
            success: true,
            message: "File deleted successfully".to_string(),
        }),
        Err(_e) => HttpResponse::InternalServerError().json(CreateDirectoryResponse {
            success: false,
            message: "Failed to delete file".to_string(),
        }),
    }
}

pub async fn delete_directory(
    data: web::Data<AppState>,
    req: web::Json<DeleteFileRequest>,
    claims: web::ReqData<TokenClaims>,
) -> impl Responder {
    let req = req.into_inner();
    let path = req.path.clone();
    info!("Deleting directory in path: {}", path);  

    match file_service::delete_directory(&data.db, path, claims.sub) {  
        Ok(_file) => HttpResponse::Ok().json(CreateDirectoryResponse {
            success: true,
            message: "Directory deleted successfully".to_string(),
        }),
        Err(_e) => HttpResponse::InternalServerError().json(CreateDirectoryResponse {
            success: false,
            message: "Failed to delete directory".to_string(),
        }),
    }
}

pub async fn create_directory_with_parent(
    data: web::Data<AppState>,
    req: web::Json<CreateDirectoryRequest>,
    claims: web::ReqData<TokenClaims>,
) -> impl Responder {
    let req = req.into_inner();
    let path = req.path.clone();
    let name = req.name.clone();
    info!("Creating directory: {} in path: {}", name, path);
    match file_service::create_directory_with_parent(&data.db, path, name, claims.sub) {
        Ok(_file) => HttpResponse::Created().json(CreateDirectoryResponse { 
            success: true,
            message: "Directory created successfully".to_string(),
        }),
        Err(_e) => HttpResponse::InternalServerError().json(CreateDirectoryResponse {
            success: false,
            message: "Failed to create directory".to_string(),
        }),
    }
}

pub async fn list_files_and_directories_in_path(
    data: web::Data<AppState>,
    req: web::Query<DeleteFileRequest>,
    claims: web::ReqData<TokenClaims>,
) -> impl Responder {
    let req = req.into_inner();
    let path = req.path.clone();
    info!("Listing files and directories in path: {}", path);

    match file_service::list_files_and_directories_in_path(&data.db, path, claims.sub) {
        Ok(file) => HttpResponse::Ok().json(FileListResponse {
            success: true,
            message: "Files and directories listed successfully".to_string(),
            data: Some(file),
        }),
        Err(_e) => HttpResponse::InternalServerError().json(FileListResponse {
            success: false,
            message: "Failed to list files and directories".to_string(),
            data: None
        }),
    }
}