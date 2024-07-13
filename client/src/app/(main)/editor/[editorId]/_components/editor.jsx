import React, { useState, useEffect } from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import initialCode from '@/utils/initial-code';
import socket from '@/utils/socket';
import PdfViewer from './pdf-viewer';
import CodeEditor from './code-editor';

const Editor = () => {
    const [code, setCode] = useState('');
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        const documentId = getDocumentIdFromPath();
        // Retrieve editor code from local storage
        const storedCode = localStorage.getItem(`editor_code_${documentId}`);
        if (storedCode) {
            setCode(storedCode);
        } else {
            setCode(initialCode);
            localStorage.setItem(`editor_code_${documentId}`, initialCode);
            socket.emit('updateCode', { documentId, code: initialCode });
        }
        socket.emit('joinDocument', documentId);

        socket.on('codeChange', (newCode) => {
            setCode(newCode);
            localStorage.setItem(`editor_code_${documentId}`, newCode);
        });

        // Listen for PDF ready event from server
        socket.on('pdfReady', ({ pdf }) => {
            const pdfBlob = new Blob([Buffer.from(pdf, 'base64')], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPdfUrl(pdfUrl);
        });

        // Clean up socket events on component unmount
        return () => {
            socket.emit('leaveDocument', documentId);
            socket.off('codeChange');
            socket.off('pdfReady');
        };
    }, []);

    const handleDelete = () => {
        const documentId = getDocumentIdFromPath();
        setCode('');
        setPdfUrl(null);
        socket.emit('updateCode', { documentId, code: '' });
        localStorage.setItem(`editor_code_${documentId}`, '');
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(code);
    };

    const handleRecompile = () => {
        const documentId = getDocumentIdFromPath();
        socket.emit('recompile', { documentId, code });
    };

    const handleChange = (value) => {
        setCode(value);
        // Update code on server via Socket.IO
        const documentId = getDocumentIdFromPath();
        socket.emit('updateCode', { documentId, code: value });
        // Update localStorage with new code
        localStorage.setItem(`editor_code_${documentId}`, value);
    };

    const getDocumentIdFromPath = () => {
        return window.location.pathname.split('/').pop();
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center">
            <div className="flex w-full h-full">
                <CodeEditor
                    code={code}
                    onChange={handleChange}
                    onDelete={handleDelete}
                    onCopyToClipboard={handleCopyToClipboard}
                    onRecompile={handleRecompile}
                />
                <PdfViewer pdfUrl={pdfUrl} code={code} />
            </div>
        </main>
    );
};

export default Editor;
