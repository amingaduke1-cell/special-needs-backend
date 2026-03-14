const db = require('../database/db');
const nodemailer = require('nodemailer');

/* ===============================
EMAIL SETUP
=============================== */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ===============================
CREATE CONTACT
=============================== */

exports.createContact = (req, res) => {

  const { name, email, supportType, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields required"
    });
  }

  const sql = `
    INSERT INTO contacts (name,email,supportType,message,createdAt)
    VALUES (?,?,?,?,NOW())
  `;

  db.query(sql, [name, email, supportType, message], (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    /* EMAIL NOTIFICATION */

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Contact Message",
      html: `
        <h2>New Message Received</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Support Type:</b> ${supportType}</p>
        <p><b>Message:</b> ${message}</p>
      `
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) console.log("Email error:", error);
    });

    res.json({
      success: true,
      data: {
        id: result.insertId,
        name,
        email,
        supportType,
        message
      }
    });

  });

};


/* ===============================
GET CONTACTS
=============================== */

exports.getContacts = (req, res) => {

  db.query(
    "SELECT * FROM contacts ORDER BY createdAt DESC",
    (err, results) => {

      if (err) {
        return res.status(500).json({
          success: false
        });
      }

      res.json({
        success: true,
        data: results
      });

    }
  );

};


/* ===============================
DELETE CONTACT
=============================== */

exports.deleteContact = (req, res) => {

  db.query(
    "DELETE FROM contacts WHERE id = ?",
    [req.params.id],
    (err) => {

      if (err) {
        return res.status(500).json({
          success: false
        });
      }

      res.json({
        success: true
      });

    }
  );

};