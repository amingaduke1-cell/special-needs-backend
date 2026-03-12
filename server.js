require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./database/db'); 

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Admin login
const admin = {
  email: "admin@email.com",
  password: "123456"
};

// Test route
app.get('/', (req, res) => {
  res.send("SNE Backend Professional Version Running");
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

  if (email === admin.email && password === admin.password) {
    const token = jwt.sign({ email: admin.email, role: "admin" }, JWT_SECRET, { expiresIn: "1h" });
    return res.json({ success: true, token });
  }

  res.status(401).json({ success: false, message: "Invalid credentials" });
});

// JWT protection middleware
function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: "No token provided" });

  try {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

// Create contact
app.post('/api/contact', (req, res) => {
  const { name, email, supportType, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ success: false, message: "All fields required" });

  const sql = 'INSERT INTO contacts (name, email, supportType, message) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, supportType, message], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Failed to save contact" });
    res.json({ success: true, data: { id: results.insertId, name, email, supportType, message } });
  });
});

// Get all contacts (protected)
app.get('/api/contact', protect, (req, res) => {
  db.query('SELECT * FROM contacts ORDER BY createdAt DESC', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Failed to fetch contacts" });
    res.json({ success: true, data: results });
  });
});

// Delete contact (protected)
app.delete('/api/contact/:id', protect, (req, res) => {
  db.query('DELETE FROM contacts WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Delete failed" });
    res.json({ success: true });
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Server error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));