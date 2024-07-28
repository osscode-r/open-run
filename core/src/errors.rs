

use actix_web::{http::StatusCode, HttpResponse, ResponseError};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum FileManagerError {
    #[error("File not found")]
    NotFound,
    #[error("Internal server error")]
    InternalServerError,
    #[error("Bad request: {0}")]
    BadRequest(String),
}

impl ResponseError for FileManagerError {
    fn error_response(&self) -> HttpResponse {
        match self {
            FileManagerError::NotFound => HttpResponse::NotFound().json("File not found"),
            FileManagerError::InternalServerError => {
                HttpResponse::InternalServerError().json("Internal server error")
            }
            FileManagerError::BadRequest(msg) => HttpResponse::BadRequest().json(msg),
        }
    }

    fn status_code(&self) -> StatusCode {
        match *self {
            FileManagerError::NotFound => StatusCode::NOT_FOUND,
            FileManagerError::InternalServerError => StatusCode::INTERNAL_SERVER_ERROR,
            FileManagerError::BadRequest(_) => StatusCode::BAD_REQUEST,
        }
    }
}