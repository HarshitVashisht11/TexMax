import React from 'react';

const PdfViewer = ({ pdfUrl, code }) => (
    <div className="w-1/2 h-full bg-white rounded-lg shadow-md flex">
        <div className="flex-grow overflow-hidden">
            {pdfUrl ? (
                <iframe
                    src={pdfUrl}
                    title="PDF Viewer"
                    style={{ height: 'calc(100vh - 60px)', width: '100%' }}
                />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                    {code ? 'Please Recompile PDF Again' : 'No code to render.'}
                </div>
            )}
        </div>
    </div>
);

export default PdfViewer;
