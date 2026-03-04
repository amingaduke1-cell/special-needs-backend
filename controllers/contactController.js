const db = require('../database/db');

exports.createContact = (req, res) => {

  const { name, email, supportType, message } = req.body;

  db.run(`
    INSERT INTO contacts
    (name,email,supportType,message,createdAt)
    VALUES (?,?,?,?,?)
  `,
    [name, email, supportType, message, new Date().toISOString()],
    function () {

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

exports.getContacts = (req, res) => {

  db.all("SELECT * FROM contacts ORDER BY id DESC", (err, rows) => {

    res.json({
      success: true,
      data: rows
    });

  });

};

exports.deleteContact = (req, res) => {

  db.run(
    "DELETE FROM contacts WHERE id=?",
    [req.params.id],
    () => {

      res.json({
        success: true
      });

    }
  );

};