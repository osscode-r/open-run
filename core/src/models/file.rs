use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct File {
    pub path: String,
    pub name: String,
    pub size: u64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub file_type: FileType,
    pub permissions: u32,
    pub is_hidden: bool,
    pub extension: Option<String>,
    pub owner_id: u32,
    pub group_id: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum FileType {
    File,
    Directory,
    Symlink,
    Other,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileResponse {
    pub success: bool,
    pub message: String,
    pub data: Option<File>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileListResponse {
    pub success: bool,
    pub message: String,
    pub data: Option<Vec<File>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateDirectoryRequest {
    pub path: String,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateDirectoryResponse {
    pub success: bool,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeleteFileRequest {
    pub path: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeleteFileResponse {
    pub success: bool,
    pub message: String,
}
