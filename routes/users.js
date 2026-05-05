
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const env = require('../consts/environment.json');
const connectionConfig = require('../consts/connection-config.json');
const delay = require('../utils/delay.util');
const express = require('express');
const getExeption = require('../utils/get-exeption.util');
const moment = require('moment');

const router = express.Router();

let sqlConnection;
(async () => {
  sqlConnection = await mysql.createConnection(connectionConfig);
})();

// POST login
router.post('/login', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    await delay(3000);
    const [rows] = await sqlConnection.execute(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );

    const user = rows[0];
    if (user && user.password === password && user.name === username) {
      // 1. Create a token (payload contains the user ID)
      const token = jwt.sign({ id: user.id }, env.secretKey, { expiresIn: '1h' });

      res.status(200).send({
        token: token,
      });
    } else {
      return getExeption(res, 401, 'Invalid credentials');
    }
  } catch (error) {
    return getExeption(res, 500, 'Server error');
  }
});

// GET /me - The "Bootstrap" call
router.get('/me', async (req, res) => {
  try {
    // 1. Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    
    // Check if header exists and starts with "Bearer "
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided, access denied.' });
    }

    // 2. Verify the JWT signature and expiration
    jwt.verify(token, env.secretKey, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token is invalid or has expired.' });
      }

      // 3. Fetch the full user row using the ID from the token payload
      // We use * here to get all metadata (avatar, address, etc.)
      const [rows] = await sqlConnection.execute(
        'SELECT * FROM users WHERE id = ?', 
        [decoded.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User no longer exists in database.' });
      }

      const user = rows[0];

      // 4. Security: Strip the password field out of the object
      // This uses the "rest" operator to create a new object without the password
      const { password, ...userWithoutPassword } = user;

      // 5. Send the full, sanitized profile back to React
      res.status(200).json(userWithoutPassword);
    });

  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(500).json({ message: 'Internal server error during re-authentication.' });
  }
});

// GET all users
router.get('/get-all-users', async (req, res) => {
  try {
    const [rows] = await sqlConnection.execute('SELECT * FROM users');
    await delay(4000);
    res.status(200).send(rows);
  } catch (error) {
    return getExeption(res, 404, 'An error has occurred :(');
  }
});

// POST register
router.post('/register', async (req, res) => {
  try {
    const { email, avatar, name, password, description, phone, type, company, address } = req.body;

    // 1. Check if email exists (More efficient than fetching all users)
    const [existing] = await sqlConnection.execute('SELECT email FROM users WHERE email = ?', [email]);
    
    await delay(4500);

    if (existing.length > 0) {
      return getExeption(res, 404, 'This email is already in use.');
    }

    // 2. Get max ID and Index (Note: Auto-increment in DB is usually better than this!)
    const [meta] = await sqlConnection.execute('SELECT MAX(id) as maxId, MAX(`index`) as maxIndex FROM users');
    const newId = (meta[0].maxId || 0) + 1;
    const newIndex = (meta[0].maxIndex || 0) + 1;
    const joinedAt = moment().format('YYYY-MM-DD');

    // 3. Insert new user
    const insertSql = `
      INSERT INTO users (id, avatar, \`index\`, name, password, registered, description, email, phone, type, company, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await sqlConnection.execute(insertSql, [
      newId, avatar, newIndex, name, password, joinedAt, description, email, phone, type, company, address
    ]);

    res.status(200).send(req.body);
  } catch (error) {
    console.error(error);
    return getExeption(res, 404, 'An error has occurred :(');
  }
});

module.exports = router;