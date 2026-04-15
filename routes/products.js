const mysql = require('mysql2/promise');
const express = require('express');
const connectionConfig = require('../consts/connection-config.json');
const getExeption = require('../functions/get-exeption');

const router = express.Router();

let sqlConnection;
(async () => {
  sqlConnection = await mysql.createConnection(connectionConfig);
})();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// GET products by family ID
router.get('/get-products-by-family-id', async (req, res) => {
  try {
    const { familyId } = req.query;

    const [rows] = await sqlConnection.execute(
      'SELECT * FROM products WHERE familyId = ?', 
      [familyId]
    );

    await delay(1800);
    res.status(200).send(rows);
  } catch (error) {
    return getExeption(res, 404, 'An error has occurred :(');
  }
});

// GET products by name
router.get('/get-products-by-name', async (req, res) => {
  try {
    const { name } = req.query;

    // For LIKE queries, pass the wildcards (%) inside the data array
    const [rows] = await sqlConnection.execute(
      'SELECT * FROM products WHERE name LIKE ?', 
      [`%${name}%`]
    );

    await delay(1500);
    res.status(200).send(rows);
  } catch (error) {
    return getExeption(res, 404, 'An error has occurred :(');
  }
});

module.exports = router;