// utils/sftpClient.js
const { Client } = require('ssh2');

const config = {
    host: process.env.SFTP_HOST,
    port: process.env.SFTP_PORT,
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD
};

const uploadFile = (username, filename, content) => {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        conn.on('ready', () => {
            conn.sftp((err, sftp) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                const remotePath = `/home/${username}/files/${filename}`;
                const buffer = Buffer.from(content, 'utf-8'); // Assurez-vous que le contenu est correctement encodé

                sftp.writeFile(remotePath, buffer, (err) => {
                    conn.end();
                    if (err) reject(err);
                    else resolve();
                });
            });
        }).on('error', (err) => {
            reject(err);
        }).connect(config);
    });
};

// Implémentez d'autres fonctions comme downloadFile, listFiles, etc.

module.exports = { uploadFile };
