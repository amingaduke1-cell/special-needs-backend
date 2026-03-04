require('dotenv').config(); // Load .env variables
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Config
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/* =============================
   Admin Account
============================= */
const admin = {
  email: "admin@email.com",
  password: "123456"
};

/* =============================
   Temporary Storage
============================= */
let contacts = [];

/* =============================
   Home Route
============================= */
app.get('/', (req, res) => {
  res.send("SNE Backend Professional Version Running");
});

/* =============================
   LOGIN ROUTE
============================= */
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

  return res.status(401).json({
    success: false,
    message: "Invalid credentials"
  });
});

/* =============================
   AUTH MIDDLEWARE
============================= */
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

/* =============================
   CREATE CONTACT
============================= */
app.post('/api/contact', (req, res) => {
  const { name, email, supportType, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields required"
    });
  }

  const newContact = {
    id: Date.now().toString(),
    name,
    email,
    supportType,
    message,
    createdAt: new Date()
  };

  contacts.unshift(newContact); // newest on top

  res.json({
    success: true,
    data: newContact
  });
});

/* =============================
   GET CONTACTS (Protected)
============================= */
app.get('/api/contact', protect, (req, res) => {
  res.json({
    success: true,
    data: contacts
  });
});

/* =============================
   DELETE CONTACT
============================= */
app.delete('/api/contact/:id', protect, (req, res) => {
  const id = req.params.id;
  contacts = contacts.filter(c => c.id !== id);

  res.json({
    success: true
  });
});

/* =============================
   GLOBAL ERROR HANDLER
============================= */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Server error"
  });
});

/* =============================
   START SERVER
============================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});