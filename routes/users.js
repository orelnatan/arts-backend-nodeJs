const mysql = require('mysql2/promise');
const express = require('express');
const connectionConfig = require('../consts/connection-config.json');
const getExeption = require('../functions/get-exeption');
const moment = require('moment');

const router = express.Router();

let sqlConnection;
(async () => {
  sqlConnection = await mysql.createConnection(connectionConfig);
})();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

// POST login
router.post('/login', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const [rows] = await sqlConnection.execute(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );

    const user = rows[0];
    await delay(4000);

    if (user) {
      if (user.password === password && user.name === username) {
        res.status(200).send(user);
      } else {
        return getExeption(res, 404, 'Wrong username or password, Please try again.');
      }
    } else {
      return getExeption(res, 404, 'Wrong email, This user does not exist.');
    }
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