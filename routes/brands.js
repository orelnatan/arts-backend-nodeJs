const mysql = require('mysql2/promise');
const express = require('express');
const connectionConfig = require('../consts/connection-config.json');
const getExeption = require('../functions/get-exeption');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

let sqlConnection;
(async () => {
  sqlConnection = await mysql.createConnection(connectionConfig);
})();

// GET all brands
router.get('/get-all-brands', authenticateToken, async (req, res) => {
  try {
    const [rows] = await sqlConnection.query('SELECT * FROM brands');

    // That 3s delay for testing/loading states
    await new Promise(resolve => setTimeout(resolve, 3000)); 

    res.status(200).send(rows);
  } catch (error) {
    return getExeption(res, 500, 'An error has occurred :(');
  }
});

module.exports = router;