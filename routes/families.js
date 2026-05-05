const mysql = require('mysql2/promise'); // Switch to promise wrapper
const express = require('express');
const connectionConfig = require('../consts/connection-config.json');
const getExeption = require('../utils/get-exeption.util');

const router = express.Router();

let sqlConnection;
(async () => {
  sqlConnection = await mysql.createConnection(connectionConfig);
})();

// Reusable delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// GET families by category ID
router.get('/get-families-by-category-id', async (req, res) => {
  try {
    const { categoryId } = req.query;

    // Use .execute with '?' to prevent SQL Injection
    const [rows] = await sqlConnection.execute(
      'SELECT * FROM families WHERE categoryId = ?', 
      [categoryId]
    );

    // Your specific 2500ms delay
    await delay(2500);

    res.status(200).send(rows);
  } catch (error) {
    // Catching both DB errors and syntax errors
    return getExeption(res, 404, 'An error has occurred :(');
  }
});

module.exports = router;