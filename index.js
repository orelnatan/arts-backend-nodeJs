
const mysql = require('mysql2/promise');
const express = require('express');
const bodyparser = require('body-parser');
const connectionConfig = require('./consts/connection-config.json');
const users = require("./routes/users");
const brands = require("./routes/brands");
// const categories = require("./routes/categories");
// const families = require("./routes/families");
// const products = require("./routes/products");

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

app.use(bodyparser.json());
app.use(allowCrossDomain);

app.use(users);
app.use(brands);
// app.use(categories);
// app.use(families);
// app.use(products);

app.listen(3001, () => {
	console.log('Express server is running at port number 3001');
});


