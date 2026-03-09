const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendContactEmail = async (contact) => {

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "New Contact Message - SNE Website",
    html: `
      <h2>New Message Received</h2>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Support Type:</strong> ${contact.supportType}</p>
      <p><strong>Message:</strong> ${contact.message}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendContactEmail;