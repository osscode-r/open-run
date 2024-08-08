use uuid::Uuid;

use crate::models::file::{File, FileType};
use std::fs::{self, create_dir, create_dir_all};
use std::os::unix::fs::PermissionsExt;
use std::path::Path;

pub fn create_directory(
    _db: &sqlx::PgPool,
    path: String,
    name: String,
    _user_id: Uuid,
) -> Result<(), String> {
    let path = Path::new(&path).join(&name);
    let _created_dir = create_dir(path);
    Ok(())
}

pub fn create_file(
    _db: &sqlx::PgPool,
    path: String,
    name: String,
    _user_id: Uuid,
) -> Result<(), String> {
    let path = Path::new(&path).join(&name);
    let created_file = std::fs::File::create(path);

    match created_file {
        Ok(_created_file) => Ok(()),
        Err(_e) => Err("Failed to create file".to_string()),
    }
}

pub fn delete_file(_db: &sqlx::PgPool, path: String, _user_id: Uuid) -> Result<(), String> {
    let path = Path::new(&path);

    match std::fs::remove_file(path) {
        Ok(_file) => Ok(()),
        Err(_e) => Err("Failed to delete file".to_string()),
    }
}

pub fn delete_directory(_db: &sqlx::PgPool, path: String, _user_id: Uuid) -> Result<(), String> {
    let path = Path::new(&path);

    match std::fs::remove_dir_all(path) {
        Ok(_file) => Ok(()),
        Err(_e) => Err("Failed to delete directory".to_string()),
    }
}

pub fn create_directory_with_parent(
    _db: &sqlx::PgPool,
    path: String,
    name: String,
    _user_id: Uuid,
) -> Result<(), String> {
    let path = Path::new(&path).join(&name);
    let _created_dir = create_dir_all(path);
    Ok(())
}

pub fn list_files_and_directories_in_path(
    _db: &sqlx::PgPool,
    path: String,
    _user_id: Uuid,
) -> Result<Vec<File>, String> {
    let path = Path::new(&path);

    if !path.exists() {
        return Err(format!("Path does not exist: {}", path.display()));
    }

    let mut files = Vec::new();

    for entry in fs::read_dir(path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let metadata = entry.metadata().map_err(|e| e.to_string())?;
        let file_type = entry.file_type().map_err(|e| e.to_string())?;

        let file = File {
            path: entry.path().to_string_lossy().into_owned(),
            name: entry.file_name().to_string_lossy().into_owned(),
            size: metadata.len(),
            created_at: metadata.created().map_err(|e| e.to_string())?.into(),
            updated_at: metadata.modified().map_err(|e| e.to_string())?.into(),
            file_type: if file_type.is_file() {
                FileType::File
            } else if file_type.is_dir() {
                FileType::Directory
            } else if file_type.is_symlink() {
                FileType::Symlink
            } else {
                FileType::Other
            },
            permissions: metadata.permissions().mode(),
            is_hidden: entry.file_name().to_string_lossy().starts_with('.'),
            extension: entry
                .path()
                .extension()
                .and_then(|s| s.to_str())
                .map(String::from),
            owner_id: get_owner_id(&metadata),
            group_id: get_group_id(&metadata),
        };

        files.push(file);
    }

    Ok(files)
}

#[cfg(unix)]
fn get_owner_id(metadata: &fs::Metadata) -> u32 {
    use std::os::unix::fs::MetadataExt;
    metadata.uid()
}

#[cfg(unix)]
fn get_group_id(metadata: &fs::Metadata) -> u32 {
    use std::os::unix::fs::MetadataExt;
    metadata.gid()
}

#[cfg(not(unix))]
fn get_owner_id(_metadata: &fs::Metadata) -> u32 {
    0 // Default value for non-Unix systems
}

#[cfg(not(unix))]
fn get_group_id(_metadata: &fs::Metadata) -> u32 {
    0 // Default value for non-Unix systems
}
