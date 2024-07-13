import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const __dirname = path.resolve();

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: '*',
    }
});

app.use(cors());

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    // Handle joining and leaving rooms based on document ID
    socket.on('joinDocument', (documentId) => {
        socket.join(documentId);
        console.log(`Socket ${socket.id} joined document ${documentId}`);
    });

    socket.on('leaveDocument', (documentId) => {
        socket.leave(documentId);
        console.log(`Socket ${socket.id} left document ${documentId}`);
    });


    // Handle code updates
    socket.on('updateCode', ({ documentId, code }) => {
        console.log(`Received code update for document ${documentId}`);
        io.to(documentId).emit('codeChange', code);
        saveCodeToFile(documentId, code);
    });

    // Handle recompile event
    socket.on('recompile', ({ documentId, code }) => {
        console.log(`Received recompile request for document ${documentId}`);
        compileLatexToPdf(documentId, code); 
    });

    function compileLatexToPdf(documentId, latexCode) {
        const texFilePath = path.join(__dirname, `${documentId}.tex`);
        const pdfFilePath = path.join(__dirname, `${documentId}.pdf`);

        fs.writeFile(texFilePath, latexCode, (err) => {
            if (err) {
                console.error('Error writing LaTeX file:', err);
                socket.emit('compileError', { error: 'Error writing LaTeX file' });
                return;
            }

            const command = `pdflatex -interaction=nonstopmode ${texFilePath}`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error compiling LaTeX:', error.message);
                    socket.emit('compileError', { error: error.message });
                    return;
                }
                if (stderr) {
                    console.error('pdflatex error:', stderr);
                    socket.emit('compileError', { error: stderr });
                    return;
                }
                console.log('PDF generated successfully');

                fs.readFile(pdfFilePath, (err, data) => {
                    if (err) {
                        console.error('Error reading PDF file:', err);
                        socket.emit('pdfError', { error: 'Error reading PDF file' });
                        return;
                    }
                    io.to(documentId).emit('pdfReady', { pdf: data.toString('base64') });

                    setTimeout(() => {
                        deleteFiles(documentId);
                    },  5*60*1000);
                });
            });
        });
    }

    function deleteFiles(documentId) {
        const texFilePath = path.join(__dirname, `${documentId}.tex`);
        const pdfFilePath = path.join(__dirname, `${documentId}.pdf`);
        const auxFilePath = path.join(__dirname, `${documentId}.aux`);
        const logFilePath = path.join(__dirname, `${documentId}.log`);

        fs.unlink(auxFilePath, (err) => {
            if (err) {
                console.error('Error deleting .aux file:', err);
            } else {
                console.log(`Deleted ${documentId}.aux`);
            }
        });

        fs.unlink(logFilePath, (err) => {
            if (err) {
                console.error('Error deleting .log file:', err);
            } else {
                console.log(`Deleted ${documentId}.log`);
            }
        })


        fs.unlink(texFilePath, (err) => {
            if (err) {
                console.error('Error deleting .tex file:', err);
            } else {
                console.log(`Deleted ${documentId}.tex`);
            }
        });

        fs.unlink(pdfFilePath, (err) => {
            if (err) {
                console.error('Error deleting .pdf file:', err);
            } else {
                console.log(`Deleted ${documentId}.pdf`);
            }
        });
    }

    function saveCodeToFile(documentId, code) {
        const texFilePath = path.join(__dirname, `${documentId}.tex`);
        fs.writeFile(texFilePath, code, (err) => {
            if (err) {
                console.error('Error saving code to file:', err);
            } else {
                console.log(`Code saved to ${documentId}.tex`);
            }
        });
    }
});

server.listen(9000, () => {
    console.log('Server is running on port 9000');
});
