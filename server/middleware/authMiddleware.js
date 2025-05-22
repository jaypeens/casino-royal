// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

/**
 * roles: an array of permitted roles (e.g. ['owner','admin'])
 * if empty, any authenticated user is allowed
 */
function authMiddleware(roles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Malformed token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // If roles specified, enforce role check
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = decoded;  // attach decoded payload to req.user
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}

module.exports = authMiddleware;
