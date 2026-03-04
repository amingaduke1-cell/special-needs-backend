const jwt = require('jsonwebtoken');

const JWT_SECRET = "supersecretkey";

module.exports = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false });
  }

  try {

    jwt.verify(authHeader.split(" ")[1], JWT_SECRET);

    next();

  } catch {
    res.status(401).json({ success: false });
  }

};