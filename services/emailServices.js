
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = async (data) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // You can change this to admin or any email you want to receive
      subject: "New Contact Message",
      text: `
Name: ${data.name}
Email: ${data.email}
Support Type: ${data.supportType}
Message: ${data.message}
      `
    });

    console.log("Email sent successfully");

  } catch (err) {
    console.error("Email failed:", err);
    throw err;
  }
};