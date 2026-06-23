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

// GET categories by brand ID using a route/path parameter
// Updated URL pattern to match standard RESTful routing: /get-categories-by-brand-id/:brandId
router.get('/get-categories-by-brand-id/:brandId', authenticateToken, async (req, res) => {
  try {
    const { brandId } = req.params; 

    // Execute query using prepared statements to prevent SQL Injection
    const [rows] = await sqlConnection.execute(
      'SELECT * FROM categories WHERE brandId = ?', 
      [brandId]
    );

    // Simulated delay (3000ms to match the brands behavior)
    await delay(2500);

    // 👇 Standardized JSON structure matching your Brands endpoint
    res.status(200).json({
      success: true,
      data: rows
    });

  } catch (error) {
    // Utilizing custom error utility consistently
    return getExeption(res, 500, 'An error has occurred :(');
  }
});

module.exports = router;