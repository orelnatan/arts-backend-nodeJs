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

// GET families by category ID using a route/path parameter
// Updated URL pattern: /get-families-by-category-id/:categoryId
router.get('/get-families-by-category-id/:categoryId', authenticateToken, async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Execute query using prepared statements to prevent SQL Injection
    const [rows] = await sqlConnection.execute(
      'SELECT * FROM families WHERE categoryId = ?', 
      [categoryId]
    );

    // Simulated delay (3000ms for a uniform server loading experience across endpoints)
    await delay(2100);

    res.status(200).json({
      success: true,
      data: rows
    });

  } catch (error) {
    return getExeption(res, 500, 'An error has occurred :(');
  }
});

module.exports = router;