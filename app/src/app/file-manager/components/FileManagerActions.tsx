import React from 'react'
import {
    FilePlusIcon,
    UploadCloudIcon,
    FolderPlusIcon,
    Trash,
} from 'lucide-react';

function FileManagerActions() {
    return (
        <div>
            <div className='flex gap-4'>
                <div className='flex items-center gap-2'>
                    <FilePlusIcon />
                    <h1>New File</h1>
                </div>
                <div className='flex items-center gap-2'>
                    <FolderPlusIcon />
                    <h1>New Folder</h1>
                </div>
                <div className='flex items-center gap-2'>
                    <UploadCloudIcon />
                    <h1>Upload File</h1>
                </div>
                <div className='flex items-center gap-2'>
                    <Trash />
                    <h1>Trash</h1>
                </div>
            </div>
        </div>
    )
}

export default FileManagerActions