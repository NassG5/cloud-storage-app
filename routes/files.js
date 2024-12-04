// routes/files.js
const fs = require('fs').promises;
const path = require('path');
const sftpClient = require('../utils/sftpclient');
const encryption = require('../utils/encryption');

const handleFiles = async (req, res) => {
    const username = req.user.username;

    if (req.method === 'GET') {
        const dashboardPage = await fs.readFile(path.join(__dirname, '../views/dashboard.html'));
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(dashboardPage);
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            const params = new URLSearchParams(body);
            const action = params.get('action');

            if (action === 'upload') {
                // Gérer l'upload de fichier
                const fileName = params.get('filename');
                const fileContent = params.get('filecontent'); // Encodé en base64 ou autre

                // Chiffrer le contenu
                const encryptedContent = encryption.encrypt(fileContent);

                try {
                    await sftpClient.uploadFile(username, fileName, encryptedContent);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ status: 'success' }));
                } catch (error) {
                    console.error(error);
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ status: 'error', message: 'Upload failed' }));
                }
            }

            // Implémentez d'autres actions comme download, share, etc.
        });
    }
};

module.exports = { handleFiles };
