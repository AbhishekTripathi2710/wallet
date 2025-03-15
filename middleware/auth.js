const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Check for token in x-auth-token header first (for backward compatibility)
  let token = req.header('x-auth-token');
  
  // If not found, check Authorization header
  if (!token && req.header('Authorization')) {
    // Format: "Bearer <token>"
    const authHeader = req.header('Authorization');
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 