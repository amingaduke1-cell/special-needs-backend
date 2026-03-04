const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = "supersecretkey";

exports.login = (req, res) => {

  const { email, password } = req.body;

  db.get(
    "SELECT * FROM admin WHERE email=? AND password=?",
    [email, password],
    (err, admin) => {

      if (!admin) {
        return res.status(401).json({
          success: false
        });
      }

      const token = jwt.sign(
        { id: admin.id, role: "admin" },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        success: true,
        token
      });

    }
  );
};