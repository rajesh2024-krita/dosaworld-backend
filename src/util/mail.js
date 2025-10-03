const nodemailer = require("nodemailer");

// Create a reusable transporter object using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // e.g., smtp.gmail.com
  port: 587, // or 465 for SSL
  secure: false, // true for 465, false for other ports
  auth: {
    user: "rajesh.kritatechnosolutions@gmail.com",
    pass: "awjx qqtp tdoe uftj", // consider using environment variable
  },
  tls: {
    rejectUnauthorized: false, // ✅ Ignore self-signed certificate
  },
});

// Send mail function
const sendMail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: '"rajesh.kritatechnosolutions@gmail.com"',
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent: ", info.messageId);
  } catch (err) {
    console.error("❌ Error sending email: ", err.message);
  }
};

module.exports = sendMail;
