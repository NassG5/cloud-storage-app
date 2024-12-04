// routes/auth.js
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersFile = path.join(__dirname, '../data/users.json');
const secretKey = process.env.SECRET_KEY;

// Inscription
const signup = async (req, res) => {
    if (req.method === 'GET') {
        const signupPage = await fs.readFile(path.join(__dirname, '../views/signup.html'));
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(signupPage);
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            const params = new URLSearchParams(body);
            const username = params.get('username');
            const password = params.get('password');

            // Vérifier si l'utilisateur existe déjà
            const usersData = await fs.readFile(usersFile, 'utf-8').catch(() => '{}');
            const users = JSON.parse(usersData);
            if (users[username]) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Utilisateur déjà existant');
                return;
            }

            // Hacher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);
            users[username] = { password: hashedPassword, role: 'user' };
            await fs.writeFile(usersFile, JSON.stringify(users, null, 2));

            res.writeHead(302, { 'Location': '/login' });
            res.end();
        });
    }
};

// Connexion
const login = async (req, res) => {
    if (req.method === 'GET') {
        const loginPage = await fs.readFile(path.join(__dirname, '../views/login.html'));
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(loginPage);
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            const params = new URLSearchParams(body);
            const username = params.get('username');
            const password = params.get('password');

            const usersData = await fs.readFile(usersFile, 'utf-8').catch(() => '{}');
            const users = JSON.parse(usersData);

            const user = users[username];
            if (!user) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Utilisateur non trouvé');
                return;
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Mot de passe incorrect');
                return;
            }

            // Générer un token JWT
            const token = jwt.sign({ username, role: user.role }, secretKey, { expiresIn: '1h' });

            // Définir le token dans un cookie
            res.writeHead(302, {
                'Set-Cookie': `token=${token}; HttpOnly; Secure`,
                'Location': '/dashboard'
            });
            res.end();
        });
    }
};

module.exports = { signup, login };
