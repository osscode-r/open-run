"use client"
import React, { useState, useEffect } from 'react'
import { useGetFilesInPathQuery } from '@/redux/services/fileManagersApi'
import { FileData } from './types'
import { FileItem } from './components/FileItem'
import { FileBreadCrumbs } from './components/FileBreadCrumbs'
import FileManagerActions from './components/FileManagerActions'
import FileManagerHeader from './components/FileManagerHeader'
import FileManagerLayouts from './components/FileManagerLayouts'
import { Loader2 } from 'lucide-react'

function FileManager() {
    const [currentPath, setCurrentPath] = useState('/')
    const [breadcrumbs, setBreadCrumbPath] = useState<string[]>([])
    const [layout, setLayout] = useState<'grid' | 'list'>('grid')
    const { data: files, isLoading, error, refetch } = useGetFilesInPathQuery({ path: currentPath })

    useEffect(() => {
        setBreadCrumbPath(currentPath.split('/').filter(Boolean))
        refetch()
    }, [currentPath, refetch])

    function fileClicked(filePath: string) {
        setCurrentPath(filePath)
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <FileManagerHeader />
            
            <div className="my-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <FileBreadCrumbs breadcrumbs={breadcrumbs} fileClicked={fileClicked} />
                <div className="flex items-center gap-4">
                    <FileManagerLayouts layout={layout} setLayout={setLayout} />
                    <FileManagerActions />
                </div>
            </div>
            
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : error ? (
                <div className="text-red-500 text-center py-8">Error loading files. Please try again.</div>
            ) : (
                <div className={`
                    ${layout === 'grid' 
                        ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4' 
                        : 'flex flex-col gap-2'}
                `}>
                    {(files || []).map((file: FileData) => (
                        <FileItem
                            fileName={file.name}
                            filePath={file.path}
                            onFolderClick={fileClicked}
                            key={file.path}
                            type={file.file_type === 'Directory' ? 'folder' : 'file'}
                            layout={layout}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default FileManager