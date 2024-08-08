export enum AUTHURLS {
    USER_LOGIN = 'v1/auth/login'
}

export enum CRONJOBURLS {
    CRON_JOBS = 'v1/cron-jobs',
    CRON_JOB = 'v1/cron-jobs/{id}'
}

export enum FILEMANAGERURLS {
    LIST_FILES_AT_PATH = 'v1/files/list-files-and-directories-in-path',
    CREATE_DIRECTORY = 'v1/files/create-directory',
    DELETE_FILE = 'v1/files/delete-file',
    CREATE_FILE = 'v1/files/create-file',
    DELETE_DIRECTORY = 'v1/files/delete-directory',
    RENAME_FILE = 'v1/files/rename-file',
    RENAME_DIRECTORY = 'v1/files/rename-directory',
}