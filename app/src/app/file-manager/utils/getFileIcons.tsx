import {
    Folder,
    FileCode,
    FileSpreadsheet,
    FileAudio,
    FileVideo,
    FileImage,
    FileText,
    FileArchive,
    FileCheck,
    FileX,
    FileCog,
    FileJson,
    FileType,
    Database,
    BrainCircuit,
    Settings,
} from 'lucide-react';

type IconProps = React.ComponentProps<typeof FileCode>;

export function getFileIcons(type: 'folder' | 'file', ext: string, layout: 'grid' | 'list'): React.ReactNode {
    const iconSize = layout === 'grid' ? 'h-20 w-20' : 'h-8 w-8';
    const baseProps: IconProps = { className: `${iconSize} text-white` };

    if (type === 'folder') {
        return <Folder {...baseProps} className={`${iconSize} text-[#58b7e9]`} fill="#58b7e9" />;
    } else {
        switch (ext.toLowerCase()) {
            case 'js':
            case 'ts':
            case 'jsx':
            case 'tsx':
                return <FileCode {...baseProps} color="#F7DF1E" />;
            case 'py':
                return <FileCode {...baseProps} color="#3776AB" />;
            case 'java':
                return <FileCode {...baseProps} color="#007396" />;
            case 'rb':
                return <FileCode {...baseProps} color="#CC342D" />;
            case 'php':
                return <FileCode {...baseProps} color="#777BB4" />;
            case 'cs':
                return <FileCode {...baseProps} color="#239120" />;
            case 'go':
                return <FileCode {...baseProps} color="#00ADD8" />;
            case 'rs':
                return <FileCode {...baseProps} color="#DEA584" />;

            case 'html':
                return <FileCode {...baseProps} color="#E34F26" />;
            case 'css':
                return <FileCode {...baseProps} color="#1572B6" />;
            case 'scss':
            case 'sass':
                return <FileCode {...baseProps} color="#CC6699" />;

            case 'json':
                return <FileJson {...baseProps} color="#000000" />;
            case 'yaml':
            case 'yml':
                return <FileType {...baseProps} color="#CB171E" />;
            case 'xml':
                return <FileCode {...baseProps} color="#0060B1" />;
            case 'csv':
            case 'tsv':
            case 'xlsx':
            case 'xls':
                return <FileSpreadsheet {...baseProps} color="#217346" />;

            case 'mp3':
            case 'wav':
            case 'ogg':
            case 'flac':
            case 'aac':
                return <FileAudio {...baseProps} color="#FF7F00" />;

            case 'mp4':
            case 'avi':
            case 'mov':
            case 'mkv':
            case 'webm':
                return <FileVideo {...baseProps} color="#FF0000" />;

            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'bmp':
            case 'svg':
            case 'webp':
                return <FileImage {...baseProps} color="#FFD700" />;

            case 'pdf':
                return <FileText {...baseProps} color="#FF0000" />;
            case 'doc':
            case 'docx':
                return <FileText {...baseProps} color="#2B579A" />;
            case 'txt':
            case 'md':
                return <FileText {...baseProps} color="#4D4D4D" />;

            case 'zip':
            case 'rar':
            case '7z':
            case 'tar':
            case 'gz':
                return <FileArchive {...baseProps} color="#FFA500" />;

            case 'exe':
            case 'app':
            case 'dmg':
                return <FileCog {...baseProps} color="#8B0000" />;

            case 'sql':
            case 'db':
            case 'sqlite':
                return <Database {...baseProps} color="#336791" />;

            case 'pkl':
            case 'h5':
            case 'onnx':
                return <BrainCircuit {...baseProps} color="#9B30FF" />;

            case 'config':
            case 'ini':
            case 'env':
                return <Settings {...baseProps} color="#A9A9A9" />;

            case 'gitignore':
            case 'npmignore':
                return <FileX {...baseProps} color="#F05032" />;
            case 'license':
            case 'dockerfile':
                return <FileCheck {...baseProps} color="#1D63ED" />;

            default:
                return <FileText {...baseProps} />;
        }
    }
}