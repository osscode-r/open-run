use std::fs;
use std::path::Path;
use std::io::Write;
use actix_web::web;
use futures::StreamExt;
use chrono::{Utc};
use uuid::Uuid;
use crate::errors::FileManagerError;
use crate::models::file::File;

pub fn list_files(storage_path: &str) -> Result<Vec<File>, FileManagerError> {
    let files = fs::read_dir(storage_path)
        .map_err(|_| FileManagerError::InternalServerError)?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let metadata = entry.metadata().ok()?;
            Some(File {
                id: entry.file_name().to_string_lossy().into_owned(),
                name: entry.file_name().to_string_lossy().into_owned(),
                size: metadata.len(),
                created_at: metadata.created().ok()?.into(),
                updated_at: metadata.modified().ok()?.into(),
            })
        })
        .collect();

    Ok(files)
}

pub async fn upload_file(
    storage_path: &str,
    mut payload: web::Payload,
    filename: &str,
) -> Result<File, FileManagerError> {
    let file_id = Uuid::new_v4().to_string();
    let file_path = Path::new(storage_path).join(&file_id);
    
    // Create the file
    let mut file = fs::File::create(&file_path)
        .map_err(|_| FileManagerError::InternalServerError)?;

    // Use a buffer to accumulate chunks
    let mut buffer = Vec::new();

    // Read from the payload
    while let Some(chunk) = payload.next().await {
        let chunk = chunk.map_err(|_| FileManagerError::InternalServerError)?;
        buffer.extend_from_slice(&chunk);
    }

    let _ = web::block(move || file.write_all(&buffer))
        .await
        .map_err(|_| FileManagerError::InternalServerError)?;

    let metadata = fs::metadata(&file_path)
        .map_err(|_| FileManagerError::InternalServerError)?;

    Ok(File {
        id: file_id,
        name: filename.to_string(),
        size: metadata.len(),
        created_at: Utc::now(),
        updated_at: Utc::now(),
    })
}

pub fn get_file_path(storage_path: &str, file_id: &str) -> Result<String, FileManagerError> {
    let file_path = Path::new(storage_path).join(file_id);
    if !file_path.exists() {
        return Err(FileManagerError::NotFound);
    }
    Ok(file_path.to_string_lossy().into_owned())
}

pub fn delete_file(storage_path: &str) -> Result<(), FileManagerError> {
    let file_path = Path::new(storage_path);
    if !file_path.exists() {
        return Err(FileManagerError::NotFound);
    }
    fs::remove_file(file_path).map_err(|_| FileManagerError::InternalServerError)
}