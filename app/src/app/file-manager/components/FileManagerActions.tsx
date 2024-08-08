import React from 'react'
import {
    FilePlusIcon,
    UploadCloudIcon,
    FolderPlusIcon,
    Trash,
} from 'lucide-react';
import { useCreateDirectoryMutation, useGetFilesInPathQuery } from '@/redux/services/fileManagersApi';

function FileManagerActions({refetch}:any) {
    const [createDirectory, { isLoading, data, error }] = useCreateDirectoryMutation()
    const createNewFolder = async () => {
        createDirectory({path:"/Users/apple", name:"New sdfgsdhfgjshdfghsdsdfsdfsd"})
        refetch()
    }

    return (
        <div>
            <div className='flex gap-4'>
                <div className='flex items-center gap-2'>
                    <FilePlusIcon />
                    <h1>New File</h1>
                </div>
                <div className='flex items-center gap-2' onClick={createNewFolder}>
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