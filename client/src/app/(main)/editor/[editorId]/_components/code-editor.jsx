import { Editor } from '@monaco-editor/react';
import { Trash2, Copy, RefreshCw } from 'lucide-react';

const CodeEditor = ({ code, onChange, onDelete, onCopyToClipboard, onRecompile }) => (
    <div className="w-1/2 h-full bg-white rounded-lg shadow-md flex flex-col">
        <div className="flex justify-end px-4 py-2 bg-blue-500 text-white">
            <button onClick={onDelete} className="px-4 py-2 flex items-center space-x-2">
                <Trash2 />
            </button>
            <button onClick={onCopyToClipboard} className="px-4 py-2 flex items-center space-x-2">
                <Copy />
            </button>
            <button onClick={onRecompile} className="px-4 py-2 flex items-center space-x-2">
                <RefreshCw />
            </button>
        </div>
        <div className="flex-grow overflow-hidden">
            <Editor
                height="100vh"
                language="latex"
                value={code}
                onChange={onChange}
            />
        </div>
    </div>
);

export default CodeEditor;
