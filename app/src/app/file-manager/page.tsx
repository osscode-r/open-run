"use client"
import React, { useState } from 'react'
import DashboardLayout from '../home/page'
import { FileCode, FilePlusIcon, FileText, FolderIcon, FolderPlusIcon, HomeIcon, Trash, UploadCloudIcon } from 'lucide-react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const files = [
    {
        name: 'File 1',
        path: '/file-1',
        type: 'folder',
    },
    {
        name: 'File 2',
        path: '/file-2',
        type: 'folder'
    },
    {
        name: 'File 3',
        path: '/file-3',
        type: 'folder'
    },
    {
        name: 'File 4',
        path: '/file-4',
        type: 'folder'
    },
    {
        name: 'File 5',
        path: '/file-5',
        type: 'folder'
    },
    {
        name: 'File 6',
        path: '/file-6',
        type: 'folder'
    },
    {
        name: 'File 7',
        path: '/file-2/file-7',
        type: 'folder'
    },
    {
        name: 'File 18',
        path: '/file-1/file-18',
        type: 'folder'
    },
    {
        name: 'File 8',
        path: '/file-2/file-7/file-8',
        type: 'folder'
    },
    {
        name: 'File 9',
        path: '/file-2/file-7/file-8/file-9',
        type: 'folder'
    },
    {
        name: 'File 10',
        path: '/file-2/file-7/file-8/file-9/file-10',
        type: 'file'
    },
    {
        name: 'File 11.yaml',
        path: '/file-2/file-7/file-8/file-9/file-11',
        type: 'file'
    },
    {
        name: 'File 11',
        path: '/file-1/file-11',
        type: 'file'
    },
    {
        name: 'File 11',
        path: '/file-2/file-12',
        type: 'folder'
    }
]


function FileManager() {
    const [filteredFiles, setfilteredFiles] = useState(files.filter((file) => file.path.startsWith('/') && file.path.split('/').length == 2))
    const [breadcrumbs, setBreadCrumbPath] = useState<string[]>([])

    function fileClicked(filePath: string) {
        if (filePath == '/') {
            setfilteredFiles(files.filter((file) => file.path.startsWith('/') && file.path.split('/').length == 2))
            setBreadCrumbPath([])
            return
        }
        setBreadCrumbPath(filePath.split('/'))
        const slashOccurrences = filePath.split('/').length;
        setfilteredFiles(files.filter((file) => file.path.startsWith(filePath) && file.path != filePath && (file.path.split('/').length - 1 == slashOccurrences)))
    }

    return (
        <DashboardLayout>
            <div className='flex justify-between items-center'>
                <div className='mb-10'>
                    <h1 className='text-3xl font-bold capitalize '>File Manager</h1>
                    <h2 className='text-xl text-muted-foreground '>Manage your files like never before</h2>
                </div>
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
            <FileBreadCrumbs breadcrumbs={breadcrumbs} fileClicked={fileClicked} />
            <div className='flex flex-wrap gap-20 mt-10'>
                {filteredFiles.map(file => (
                    <FileItem fileName={file.name} filePath={file.path} onFolderClick={fileClicked} key={file.path} type={file.type as 'folder' | 'file'} />
                ))}
            </div>
        </DashboardLayout>
    )
}

export default FileManager


const FileItem = ({ fileName, filePath, onFolderClick, type }: { fileName: string, filePath: string, onFolderClick: (filePath: string) => void, type: 'folder' | 'file' }) => {
    return (
        <div className='flex items-center flex-col' onClick={() => { if (type == 'folder') onFolderClick(filePath) }}>
            {getFileIcons(type, fileName.split('.').pop() as string)}
            <p>{fileName}</p>
        </div>
    )
}

const FileBreadCrumbs = ({ breadcrumbs, fileClicked }: { breadcrumbs: string[], fileClicked: (filePath: string) => void }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className='cursor-pointer' onClick={() => fileClicked('/')}>
                    <BreadcrumbPage><HomeIcon className="h-5 w-5" /></BreadcrumbPage>
                </BreadcrumbItem>
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbItem onClick={() => fileClicked(breadcrumbs.slice(0, index + 1).join('/'))} className='cursor-pointer'>
                            {index === breadcrumbs.length - 1 ? (
                                <BreadcrumbPage>{crumb}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <h1>{crumb}</h1>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

function getFileIcons(type: 'folder' | 'file', ext: string): React.ReactNode {
    if (type == 'folder') {
        return <FolderIcon className="h-20 w-20 text-[#58b7e9]" fill="#58b7e9" />
    } else {
        switch (ext) {
            case "yaml":
                return <FileCode className="h-20 w-20 text-[#fff]" />
            default:
                return <FileText className="h-20 w-20 text-[#fff]" />
        }
    }
}