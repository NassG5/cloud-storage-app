// routes/index.js
const auth = require('./auth');
const files = require('./files');
const fs = require('fs');
const path = require('path');

module.exports = {
    '/': (req, res) => {
        fs.readFile(path.join(__dirname, '../views/index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('500 Internal Server Error');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    },
    '/signup': auth.signup,
    '/login': auth.login,
    '/dashboard': (req, res) => {
        fs.readFile(path.join(__dirname, '../views/dashboard.html'), (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('500 Internal Server Error');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    },
    '/files': files.handleFiles,
    // Ajoutez d'autres routes selon les besoins
};
