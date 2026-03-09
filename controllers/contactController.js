const db = require('../database/db');
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// CREATE CONTACT
exports.createContact = (req, res) => {

  const { name, email, supportType, message } = req.body;

  db.run(`
    INSERT INTO contacts
    (name,email,supportType,message,createdAt)
    VALUES (?,?,?,?,?)
  `,
    [name, email, supportType, message, new Date().toISOString()],
    function (err) {

      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }

      // Send email notification
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "New Contact Message",
        html: `
          <h2>New Message Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Support Type:</strong> ${supportType}</p>
          <p><strong>Message:</strong> ${message}</p>
        `
      };

      transporter.sendMail(mailOptions, (error) => {

        if (error) {
          console.log("Email error:", error);
        }

      });

      res.json({
        success: true,
        data: {
          id: this.lastID,
          name,
          email,
          supportType,
          message
        }
      });

    });

};


// GET CONTACTS
exports.getContacts = (req, res) => {

  db.all("SELECT * FROM contacts ORDER BY id DESC", (err, rows) => {

    if (err) {
      return res.status(500).json({
        success: false
      });
    }

    res.json({
      success: true,
      data: rows
    });

  });

};


// DELETE CONTACT
exports.deleteContact = (req, res) => {

  db.run(
    "DELETE FROM contacts WHERE id=?",
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