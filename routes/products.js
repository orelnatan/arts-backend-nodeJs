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

// 2. GET a single product by product ID
// URL pattern: /get-product-by-id/:id
router.get('/get-product-by-id/:id', authenticateToken, async (req, res) => {
  try {
    // Extract the 'id' path parameter from the URL
    const { id } = req.params;

    // Execute the query to find the specific product
    const [rows] = await sqlConnection.execute(
      'SELECT * FROM products WHERE id = ?', 
      [id]
    );

    // Optional: Simulating network latency just like your other route
    await delay(2000); 

    // Safety check: If no product was found with that ID, return a 404
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Since IDs are unique, rows will contain exactly one item. 
    // We pass rows[0] to send the single product object back to React.
    res.status(200).json({
      success: true,
      data: rows[0] 
    });
  } catch (error) {
    // Falls back to your custom error handler
    return getExeption(res, 500, 'An error has occurred fetching the product :(');
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

// PUT /update-product/:id
router.put('/update-product/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Destructure all the fields from the incoming Product object
    const { 
      name, description, image, index, serial,
      height, width, weight, price, familyId, added 
    } = req.body;

    await delay(1800);

    // With PUT, we update every single column. If a value didn't change, 
    // it simply overwrites itself with the same value.
    const [result] = await sqlConnection.execute(
      `UPDATE products 
       SET name = ?, description = ?, image = ?, \`index\` = ?, serial = ?, 
           height = ?, width = ?, weight = ?, price = ?, added = ?, familyId = ?
       WHERE id = ?`,
      [name, description, image, index, serial, height, width, weight, price, added, familyId, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    return getExeption(res, 500, 'Failed to update product');
  }
});

module.exports = router;