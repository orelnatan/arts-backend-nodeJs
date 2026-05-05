const jwt = require('jsonwebtoken');

const env = require('../consts/environment.json');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, env.secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    
    // Attach the user info to the request object so the next function can use it
    req.user = user; 
    
    // Move to the actual route handler
    next(); 
  });
};

module.exports = authenticateToken;