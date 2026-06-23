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

// 1. GET products by family ID (Path Parameter drill-down syntax)
// Updated URL pattern: /get-products-by-family-id/:familyId
router.get('/get-products-by-family-id/:familyId', authenticateToken, async (req, res) => {
  try {
    const { familyId } = req.params;

    const [rows] = await sqlConnection.execute(
      'SELECT * FROM products WHERE familyId = ?', 
      [familyId]
    );

    await delay(2000); 
    
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    return getExeption(res, 500, 'An error has occurred :(');
  }
});

// 2. GET products by name (Query Parameter search syntax)
// Kept as req.query. URL will look like: /get-products-by-name?name=something
router.get('/get-products-by-name', authenticateToken, async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(200).json({ success: true, data: [] });
    }

    const [rows] = await sqlConnection.execute(
      'SELECT * FROM products WHERE name LIKE ?', 
      [`%${name}%`]
    );

    await delay(1000); 
    
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    return getExeption(res, 500, 'An error has occurred :(');
  }
});

module.exports = router;