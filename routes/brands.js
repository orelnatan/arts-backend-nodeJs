const mysql = require('mysql2/promise');
const express = require('express');
const connectionConfig = require('../consts/connection-config.json');
const getExeption = require('../functions/get-exeption');

const router = express.Router();

let sqlConnection;
(async () => {
  sqlConnection = await mysql.createConnection(connectionConfig);
})();

// GET all brands.
router.get('/get-all-brands', async (req, res) => {
  try {
    const [rows] = await sqlConnection.query('SELECT * FROM brands');

    await new Promise(resolve => setTimeout(resolve, 3000)); // clean delay

    res.status(200).send(rows);
  } catch (error) {
    return getExeption(res, 404, 'An error has occurred :(');
  }
});

module.exports = router;