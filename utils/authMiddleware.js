// utils/authMiddleware.js
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

const authMiddleware = (req, res) => {
    return new Promise((resolve, reject) => {
        const cookie = req.headers.cookie;
        if (!cookie) {
            res.writeHead(401, {'Content-Type': 'text/plain'});
            res.end('Non autorisé');
            return resolve(null);
        }

        const tokenMatch = cookie.match(/token=([^;]+)/);
        if (!tokenMatch) {
            res.writeHead(401, {'Content-Type': 'text/plain'});
            res.end('Non autorisé');
            return resolve(null);
        }

        const token = tokenMatch[1];
        if (!token) {
            res.writeHead(401, {'Content-Type': 'text/plain'});
            res.end('Non autorisé');
            return resolve(null);
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.writeHead(401, {'Content-Type': 'text/plain'});
                res.end('Non autorisé');
                return resolve(null);
            }
            resolve(decoded);
        });
    });
};

module.exports = authMiddleware;
