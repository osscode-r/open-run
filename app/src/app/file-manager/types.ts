
export interface FileData {
    path: string;
    name: string;
    size: number;
    created_at: string;
    updated_at: string;
    file_type: FileType;
    permissions: number;
    is_hidden: boolean;
    extension: string | null;
    owner_id: number;
    group_id: number;
}

export enum FileType {
    File = 'File',
    Directory = 'Directory',
    Symlink = 'Symlink',
    Other = 'Other'
}

export interface FileResponse {
    success: boolean;
    message: string;
    data: FileData | null;
}

export interface FileListResponse {
    success: boolean;
    message: string;
    data: FileData[] | null;
}

export interface CreateDirectoryRequest {
    path: string;
    name: string;
}

export interface CreateDirectoryResponse {
    success: boolean;
    message: string;
}

export interface DeleteFileRequest {
    path: string;
}

export interface DeleteFileResponse {
    success: boolean;
    message: string;
}