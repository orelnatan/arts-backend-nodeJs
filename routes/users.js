
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const env = require('../consts/environment.json');
const connectionConfig = require('../consts/connection-config.json');
const authenticateToken = require('../middlewares/auth.middleware');
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
      return getExeption(res, 401, 'Invalid credentials - User, email or password are incorrect');
    }
  } catch (error) {
    return getExeption(res, 500, 'Server error');
  }
});

// GET /me - The "Bootstrap" call
router.get('/fetch-user', async (req, res) => {
  try {
    await delay(3000);

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

// PUT /update-user - Full update
router.put('/update-user', authenticateToken, async (req, res) => {
  try {
    await delay(3000);

    // 1. Destructure to extract the ID and password (if you want to handle it), 
    // and grab the rest of the profile properties as a clean object
    const { id, password, registered, index, ...profileData } = req.body;
    const userId = req.user.id; // Always trust the token ID for safety

    // 2. Automate the assignment string: "avatar = ?, name = ?, ..."
    const setClause = Object.keys(profileData).map(key => `${key} = ?`).join(', ');
    
    // 3. Collect the corresponding values, forcing undefined/empty values to null
    const queryValues = Object.values(profileData).map(val => val ?? null);

    // 4. Run the update query
    const [updateResult] = await sqlConnection.execute(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      [...queryValues, userId] // Spreading the clean array values right into the parameters
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 5. Fetch and return the fresh user record
    const [rows] = await sqlConnection.execute('SELECT * FROM users WHERE id = ?', [userId]);
    const { password: _, ...userWithoutPassword } = rows[0];

    return res.status(200).json(userWithoutPassword);

  } catch (error) {
    console.error('Update User Error:', error);
    return getExeption(res, 500, 'Server error during user update.');
  }
});

module.exports = router;