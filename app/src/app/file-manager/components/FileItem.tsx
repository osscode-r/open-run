import { getFileIcons } from "../utils/getFileIcons"

export interface FileItemProps {
    fileName: string,
    filePath: string,
    onFolderClick: (filePath: string) => void,
    type: 'folder' | 'file', layout: 'grid' | 'list'
}

export const FileItem = ({ fileName, filePath, onFolderClick, type, layout }: FileItemProps) => {
    return (
        <div
            className={`flex items-center ${layout === 'grid' ? 'flex-col' : 'flex-row gap-4'} cursor-pointer`}
            onClick={() => { if (type === 'folder') onFolderClick(filePath) }}
        >
            {getFileIcons(type, fileName.split('.').pop() as string, layout)}
            <p>{fileName}</p>
        </div>
    )
}