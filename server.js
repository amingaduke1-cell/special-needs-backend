require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const contactController = require('./controllers/contactController');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/* ===============================
ADMIN LOGIN
=============================== */

const admin = {
  email: "admin@email.com",
  password: "123456"
};

app.post('/api/auth/login', (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required"
    });
  }

  if (email === admin.email && password === admin.password) {

    const token = jwt.sign(
      { email: admin.email, role: "admin" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      success: true,
      token
    });

  }

  res.status(401).json({
    success: false,
    message: "Invalid credentials"
  });

});

/* ===============================
JWT PROTECTION
=============================== */

function protect(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided"
    });
  }

  try {

    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET);
    next();

  } catch {

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });

  }

}

/* ===============================
CONTACT ROUTES
=============================== */

app.post('/api/contact', contactController.createContact);

app.get('/api/contact', protect, contactController.getContacts);

app.delete('/api/contact/:id', protect, contactController.deleteContact);


/* ===============================
TEST ROUTE
=============================== */

app.get('/', (req, res) => {
  res.send("SNE Backend Running");
});


/* ===============================
SERVER START
=============================== */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});