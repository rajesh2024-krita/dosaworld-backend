// const nodemailer = require("nodemailer");

// // Create a reusable transporter object using SMTP
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com", // e.g., smtp.gmail.com
//   port: 587, // or 465 for SSL
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: "rajesh.kritatechnosolutions@gmail.com",
//     pass: "awjx qqtp tdoe uftj", // consider using environment variable
//   },
//   tls: {
//     rejectUnauthorized: false, // ✅ Ignore self-signed certificate
//   },
// });

// // Send mail function
// const sendMail = async ({ to, subject, text, html }) => {
//   try {
//     const info = await transporter.sendMail({
//       from: '"rajesh.kritatechnosolutions@gmail.com"',
//       to,
//       subject,
//       text,
//       html,
//     });

//     console.log("✅ Email sent: ", info.messageId);
//   } catch (err) {
//     console.error("❌ Error sending email: ", err.message);
//   }
// };

// module.exports = sendMail;


const nodemailer = require("nodemailer");

// Create a reusable transporter object using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "dosaworldhamburg@gmail.com",
    pass: "wfcr wweb mwpn edyj",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Send mail function (original)
const sendMail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: '"Dosa World" <dosaworldhamburg@gmail.com>',
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent: ", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("❌ Error sending email: ", err.message);
    return { success: false, error: err.message };
  }
};

// Send mail with attachment function
const sendMailWithAttachment = async ({ to, subject, text, html, attachments }) => {
  try {
    const info = await transporter.sendMail({
      from: '"Dosa World" <dosaworldhamburg@gmail.com>',
      to,
      subject,
      text,
      html,
      attachments,
    });

    console.log("✅ Email with attachment sent: ", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("❌ Error sending email with attachment: ", err.message);
    return { success: false, error: err.message };
  }
};

// Send invoice email function
const sendInvoiceEmail = async (customerEmail, customerName, partyId, pdfBuffer, lang = 'en') => {
  const invoiceSubjects = {
    en: `Your Dosa World Invoice - Party #${partyId}`,
    de: `Ihre Dosa World Rechnung - Party #${partyId}`
  };

  const invoiceBodies = {
    en: `
      <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); padding: 30px; border-radius: 16px; border: 1px solid #a7f3d0; max-width: 600px; margin: auto;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #10b981;">
          <img src="https://dosaworld.de/assets/logo-H7Hfdi3N.png" alt="Dosa World Logo" style="width: 120px; margin-bottom: 15px;">
          <h2 style="color: #047857; margin: 0; font-size: 28px;">📄 Your Invoice</h2>
          <p style="color: #059669; margin: 5px 0 0 0; font-size: 16px;">Thank you for your business!</p>
        </div>

        <div style="padding: 25px; font-size: 16px;">
          <p>Dear <strong style="color: #065f46;">${customerName}</strong>,</p>
          <p>Please find attached the invoice for your recent party booking at <strong style="color: #065f46;">Dosa World</strong>.</p>
          
          <div style="background: white; border: 2px solid #34d399; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
            <h3 style="color: #047857; margin-top: 0;">Invoice Details</h3>
            <p><strong>Party ID:</strong> ${partyId}</p>
            <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p>This invoice is also available in your customer portal.</p>
          </div>

          <div style="background: #fffbeb; border: 1px solid #fcd34d; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #d97706; margin: 0;">💡 Important Information</h4>
            <p style="margin: 10px 0 0 0;">Please review the attached invoice carefully. If you have any questions or notice any discrepancies, don't hesitate to contact us.</p>
          </div>

          <p>If you have any questions about your invoice, please don't hesitate to contact us.</p>

          <p style="margin-top: 30px;">Warm regards,<br>
          <strong style="color: #047857; font-size: 18px;">The Dosa World Team</strong></p>
        </div>

        <div style="text-align: center; border-top: 2px solid #10b981; padding-top: 20px; font-size: 14px; color: #6b7280;">
          <p>📍 Lämmertwiete 2 21073 Hamburg, Germany</p>
          <p>📞 +4917622213135 | ✉️ dosaworldhamburg@gmail.com</p>
        </div>
      </div>
    `,
    de: `
      <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); padding: 30px; border-radius: 16px; border: 1px solid #a7f3d0; max-width: 600px; margin: auto;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #10b981;">
          <img src="https://dosaworld.de/assets/logo-H7Hfdi3N.png" alt="Dosa World Logo" style="width: 120px; margin-bottom: 15px;">
          <h2 style="color: #047857; margin: 0; font-size: 28px;">📄 Ihre Rechnung</h2>
          <p style="color: #059669; margin: 5px 0 0 0; font-size: 16px;">Vielen Dank für Ihren Auftrag!</p>
        </div>

        <div style="padding: 25px; font-size: 16px;">
          <p>Sehr geehrte/r <strong style="color: #065f46;">${customerName}</strong>,</p>
          <p>Anbei finden Sie die Rechnung für Ihre kürzliche Party-Buchung im <strong style="color: #065f46;">Dosa World</strong>.</p>
          
          <div style="background: white; border: 2px solid #34d399; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
            <h3 style="color: #047857; margin-top: 0;">Rechnungsdetails</h3>
            <p><strong>Party ID:</strong> ${partyId}</p>
            <p><strong>Rechnungsdatum:</strong> ${new Date().toLocaleDateString('de-DE')}</p>
            <p>Diese Rechnung ist auch in Ihrem Kundenportal verfügbar.</p>
          </div>

          <div style="background: #fffbeb; border: 1px solid #fcd34d; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #d97706; margin: 0;">💡 Wichtige Information</h4>
            <p style="margin: 10px 0 0 0;">Bitte überprüfen Sie die beigefügte Rechnung sorgfältig. Wenn Sie Fragen haben oder Unstimmigkeiten feststellen, zögern Sie nicht, uns zu kontaktieren.</p>
          </div>

          <p>Wenn Sie Fragen zu Ihrer Rechnung haben, zögern Sie bitte nicht, uns zu kontaktieren.</p>

          <p style="margin-top: 30px;">Mit herzlichen Grüßen,<br>
          <strong style="color: #047857; font-size: 18px;">Ihr Dosa World Team</strong></p>
        </div>

        <div style="text-align: center; border-top: 2px solid #10b981; padding-top: 20px; font-size: 14px; color: #6b7280;">
          <p>📍 Lämmertwiete 2 21073 Hamburg, Germany</p>
          <p>📞 +4917622213135 | ✉️ dosaworldhamburg@gmail.com</p>
        </div>
      </div>
    `
  };

  const textContent = {
    en: `Your Dosa World invoice for party ${partyId} is attached. Thank you for your business!`,
    de: `Ihre Dosa World Rechnung für Party ${partyId} ist angehängt. Vielen Dank für Ihren Auftrag!`
  };

  const attachments = [
    {
      filename: `Invoice-${partyId}-${customerName.replace(/\s+/g, '_')}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    }
  ];

  const result = await sendMailWithAttachment({
    to: customerEmail,
    subject: invoiceSubjects[lang],
    text: textContent[lang],
    html: invoiceBodies[lang],
    attachments
  });

  return result;
};

// Send invoice to admin for review
const sendInvoiceToAdmin = async (partyDetails, pdfBuffer) => {
  const adminEmail = "dosaworldhamburg@gmail.com";
  
  const subject = `New Invoice Generated - Party #${partyDetails.id} - ${partyDetails.partyName}`;
  
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 700px; margin: auto;">
      <div style="text-align: center; padding-bottom: 15px; border-bottom: 2px solid #10b981;">
        <h2 style="color: #047857; margin: 0;">📄 New Invoice Generated</h2>
      </div>
      
      <div style="padding: 20px; font-size: 16px; background: white; border-radius: 8px; margin: 15px 0;">
        <p>A new invoice has been generated for the following party:</p>
        
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 15px 0;">
          <h3 style="color: #047857; margin-top: 0;">Party Details</h3>
          <p><strong>Party ID:</strong> ${partyDetails.id}</p>
          <p><strong>Party Name:</strong> ${partyDetails.partyName}</p>
          <p><strong>Customer Name:</strong> ${partyDetails.customerName}</p>
          <p><strong>Email:</strong> ${partyDetails.email || "N/A"}</p>
          <p><strong>Phone:</strong> ${partyDetails.phone}</p>
          <p><strong>Due Date:</strong> ${partyDetails.dueDate}</p>
          <p><strong>Guests:</strong> ${partyDetails.guests}</p>
          <p><strong>Status:</strong> <span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 14px;">${partyDetails.status}</span></p>
          <p><strong>Generated Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">The invoice has been automatically sent to the customer and is attached to this email for your records.</p>
      </div>
    </div>
  `;

  const text = `New invoice generated for Party #${partyDetails.id} - ${partyDetails.partyName}. Customer: ${partyDetails.customerName}`;

  const attachments = [
    {
      filename: `Invoice-${partyDetails.id}-${partyDetails.customerName.replace(/\s+/g, '_')}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    }
  ];

  const result = await sendMailWithAttachment({
    to: adminEmail,
    subject,
    text,
    html,
    attachments
  });

  return result;
};

// Verify transporter connection
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP transporter is ready to send emails");
    return true;
  } catch (error) {
    console.error("❌ SMTP transporter verification failed:", error);
    return false;
  }
};

module.exports = {
  sendMail,
  sendMailWithAttachment,
  sendInvoiceEmail,
  sendInvoiceToAdmin,
  verifyTransporter
};