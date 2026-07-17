
const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const connectionConfig = require('./consts/connection-config.json');
const users = require("./routes/users");
const brands = require("./routes/brands");
const categories = require("./routes/categories");
const families = require("./routes/families");
const products = require("./routes/products");
const imageBB = require("./routes/image-bb");

const app = express();
const allowCrossDomain = require('./utils/allow-cross-domain.util');

let sqlConnection;
(async () => {
  try {
    sqlConnection = await mysql.createConnection(connectionConfig);

    console.log('Database connection succeeded!');
  } catch (error) {
    console.error('Database connection failed!', error);
  }
})();

app.use(cors({
  origin: 'http://localhost:5173', // Your React dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'], // <--- CRITICAL: Add Authorization here
}));

// 1. Raise the limit for standard JSON payloads (like your base64 string)
app.use(express.json({ limit: '50mb' }));

// 2. Raise the limit for url-encoded payloads if you accept them elsewhere
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyparser.json());
app.use(allowCrossDomain);

app.use(users);
app.use(brands);
app.use(categories);
app.use(families);
app.use(products);
app.use(imageBB);

app.listen(3001, () => {
	console.log('Express server is running at port number 3001');
});


