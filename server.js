require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Contact = require('./models/contact');

const app = express();


app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


const admin = {
  email: "admin@email.com",
  password: "123456"
};


app.get('/', (req, res) => {
  res.send("SNE Backend Professional Version Running");
});


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

app.post('/api/contact', async (req, res) => {

  const { name, email, supportType, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields required"
    });
  }

  try {

    const newContact = await Contact.create({
      name,
      email,
      supportType,
      message
    });

    res.json({
      success: true,
      data: newContact
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to save contact"
    });

  }

});

app.get('/api/contact', protect, async (req, res) => {

  try {

    const contacts = await Contact
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: contacts
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts"
    });

  }

});

app.delete('/api/contact/:id', protect, async (req, res) => {

  try {

    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Delete failed"
    });

  }

});


app.use((err, req, res, next) => {

  console.error(err);

  res.status(500).json({
    success: false,
    message: "Server error"
  });

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const { sendEmail } = require("./services/emailServices");

sendEmail({
  name: "Test",
  email: "test@gmail.com",
  supportType: "Testing",
  message: "This is a test"
});