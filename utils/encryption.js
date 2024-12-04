// utils/encryption.js
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256').update(String(process.env.SECRET_KEY)).digest('base64').substr(0, 32);
const ivLength = 16; // Pour AES, c'est toujours 16

// Chiffrement
const encrypt = (text) => {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

// Déchiffrement
const decrypt = (text) => {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = parts.join(':');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = { encrypt, decrypt };
