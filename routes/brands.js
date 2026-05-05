const mysql = require('mysql2/promise');
const connectionConfig = require('../consts/connection-config.json');
const delay = require('../utils/delay.util');
const getExeption = require('../utils/get-exeption.util');
const authenticateToken = require('../middlewares/auth.middleware');
const express = require('express');

const router = express.Router();

let sqlConnection;
(async () => {
  sqlConnection = await mysql.createConnection(connectionConfig);
})();

// GET all brands
router.get('/get-all-brands', authenticateToken, async (req, res) => {
  try {
    const [rows] = await sqlConnection.query('SELECT * FROM brands');

    await delay(3000);

    res.status(200).send(rows);
  } catch (error) {
    return getExeption(res, 500, 'An error has occurred :(');
  }
});

module.exports = router;