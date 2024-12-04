// app.js
require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const routes = require('./routes/index');
const authMiddleware = require('./utils/authMiddleware');

const port = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
    // Parse l'URL
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Gérer les routes
    try {
        // Appliquer le middleware d'authentification pour certaines routes
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/files')) {
            const user = await authMiddleware(req, res);
            if (!user) return;
            req.user = user;
        }

        const routeHandler = routes[pathname];
        if (routeHandler) {
            routeHandler(req, res);
        } else {
            // Servir les fichiers statiques depuis le dossier public
            const filePath = path.join(__dirname, 'public', pathname);
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.end('404 Not Found');
                } else {
                    const ext = path.extname(filePath).toLowerCase();
                    const mimeTypes = {
                        '.html': 'text/html',
                        '.css': 'text/css',
                        '.js': 'application/javascript',
                        '.png': 'image/png',
                        '.jpg': 'image/jpg',
                        '.gif': 'image/gif'
                    };
                    res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'application/octet-stream'});
                    res.end(data);
                }
            });
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('500 Internal Server Error');
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
