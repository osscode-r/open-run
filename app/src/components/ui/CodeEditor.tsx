import React from 'react';
import dynamic from 'next/dynamic';

const AceEditor = dynamic(
    async () => {
        const ace = await import('react-ace');
        await import('ace-builds/src-noconflict/mode-yaml');
        await import('ace-builds/src-noconflict/mode-sh');
        await import('ace-builds/src-noconflict/theme-monokai');
        return ace;
    },
    { ssr: false }
);

interface AceEditorProps {
    mode: "yaml" | "sh";
    value: string;
    onChange: (value: string) => void;
    name: string;
    theme?: string;
}

export const AceEditorComponent: React.FC<AceEditorProps> = ({ mode, value, onChange, name }) => (
    <AceEditor
        mode={mode}
        theme="monokai"
        onChange={onChange}
        value={value}
        name={name}
        editorProps={{ $blockScrolling: true }}
        fontSize={14}
        lineHeight={19}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
            useWorker: true
        }}
        style={{ width: '100%', height: '400px' }}
    />
);