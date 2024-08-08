import { useState } from "react"
import { getFileIcons } from "../utils/getFileIcons"

export interface FileItemProps {
    fileName: string,
    filePath: string,
    onFolderClick: (filePath: string) => void,
    type: 'folder' | 'file', layout: 'grid' | 'list',
    activePath: string,
    onFolderClickActive: (filePath: string) => void
}

export const FileItem = ({ fileName, filePath, onFolderClick, type, layout, activePath, onFolderClickActive }: FileItemProps) => {
    return (
        <div
            className={`flex items-center ${layout === 'grid' ? 'flex-col' : 'flex-row gap-4'} cursor-pointer` + (activePath === filePath ? ' bg-muted rounded-lg' : '')}
            onClick={() => onFolderClickActive(filePath)}
            onDoubleClick={() => {
                if (type === 'folder')
                    onFolderClick(filePath)
            }}
        >
            {getFileIcons(type, fileName.split('.').pop() as string, layout)}
            <p className={`truncate px-4` + (activePath === filePath ? ' bg-blue-600 rounded-md' : '')}>{fileName}</p>
        </div>
    )
}