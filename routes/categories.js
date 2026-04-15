const mysql = require('mysql2/promise'); // Ensure you use the promise wrapper
const express = require('express');
const connectionConfig = require('../consts/connection-config.json');
const getExeption = require('../functions/get-exeption');

const router = express.Router();

let sqlConnection;
(async () => {
  sqlConnection = await mysql.createConnection(connectionConfig);
})();

// Helper for the simulated delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// GET categories by brand ID
router.get('/get-categories-by-brand-id', async (req, res) => {
  try {
    const { brandId } = req.query;

    // 1. Execute query using prepared statements to prevent SQL Injection
    // 2. Destructure the result to get the rows
    const [rows] = await sqlConnection.execute(
      'SELECT * FROM categories WHERE brandId = ?', 
      [brandId]
    );

    // Simulated delay
    await delay(2000);

    res.status(200).send(rows);
  } catch (error) {
    return getExeption(res, 404, 'An error has occurred :(');
  }
});

module.exports = router;