const PartyModel = require("../models/partyModel");
const {
  sendMail,
  sendInvoiceEmail,
  sendInvoiceToAdmin,
} = require("../util/mail");

// Helper function to detect language
const detectLanguage = (phone) => (phone.startsWith("+49") ? "de" : "en");

// Helper function to convert base64 to buffer
// const base64ToBuffer = (base64String) => {
//   const base64Data = base64String.replace(/^data:application\/pdf;base64,/, '');
//   return Buffer.from(base64Data, 'base64');
// };

const base64ToBuffer = (base64String) => {
  if (!base64String) throw new Error("Invoice PDF is missing");
  // Remove data URI prefix and whitespace
  const cleaned = base64String
    .replace(/^data:application\/pdf;base64,/, "")
    .replace(/\s/g, "");
  return Buffer.from(cleaned, "base64");
};

// Helper function to save invoice PDF
const saveInvoicePDF = async (partyId, pdfBuffer) => {
  try {
    // TODO: Implement your PDF storage logic here
    // This could be saving to database, file system, cloud storage, etc.

    // Example for file system:
    // const fs = require('fs').promises;
    // const fileName = `invoice-${partyId}-${Date.now()}.pdf`;
    // await fs.writeFile(`./invoices/${fileName}`, pdfBuffer);

    // Example for database (you'll need to modify your PartyModel):
    // await PartyModel.saveInvoicePDF(partyId, pdfBuffer);

    console.log(`Invoice PDF saved for party ${partyId}`);
    return true;
  } catch (error) {
    console.error("Error saving invoice PDF:", error);
    throw error;
  }
};

const PartyController = {
  // Get all parties
  getAllParties: async (req, res) => {
    try {
      const allParties = await PartyModel.getAll();
      res.status(200).json({
        success: true,
        data: allParties,
        count: allParties.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching parties",
        error: error.message,
      });
    }
  },

  // Get party by ID
  getPartyById: async (req, res) => {
    try {
      const { id } = req.params;
      const party = await PartyModel.getById(id);

      if (!party) {
        return res
          .status(404)
          .json({ success: false, message: "Party not found" });
      }

      res.json({ success: true, data: party });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching party",
        error: error.message,
      });
    }
  },

  // Add new party with professional emails
  addParty: async (req, res) => {
    try {
      const {
        partyName,
        customerName,
        phone,
        email,
        issuedDate,
        dueDate,
        guests = 0,
        status = "registered",
        products = [],
        address,
        invoicePdf,
      } = req.body;

      if (!partyName || !customerName || !phone || !dueDate || !address) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: partyName, customerName, phone, dueDate, address",
        });
      }

      const newParty = await PartyModel.create({
        partyName,
        customerName,
        phone,
        email: email || "",
        issuedDate: issuedDate || new Date().toISOString(),
        dueDate,
        guests,
        status,
        products,
        address,
      });

      const adminEmail = "dosaworldhamburg@gmail.com";
      const lang = detectLanguage(phone);

      // Email subjects
      const subjects = {
        admin: "New Party Booking - Dosa World",
        customer: {
          en: "Your Party Booking at Dosa World is Confirmed!",
          de: "Ihre Party-Buchung im Dosa World wurde bestätigt!",
        },
      };

      // Professional admin email template
      const adminBody = `
        <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 700px; margin: auto;">
          <div style="text-align: center; padding-bottom: 15px; border-bottom: 2px solid #10b981;">
            <h2 style="color: #047857; margin: 0;">🎉 New Party Booking Received</h2>
          </div>
          
          <div style="padding: 20px; font-size: 16px; background: white; border-radius: 8px; margin: 15px 0;">
            <p>A new party has been registered at <strong style="color: #065f46;">Dosa World</strong>.</p>
            
            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 15px 0;">
              <h3 style="color: #047857; margin-top: 0;">Party Details</h3>
              <p><strong>Party Name:</strong> ${partyName}</p>
              <p><strong>Customer Name:</strong> ${customerName}</p>
              <p><strong>Email:</strong> ${email || "N/A"}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Issued Date:</strong> ${
                issuedDate || new Date().toISOString().split("T")[0]
              }</p>
              <p><strong>Due Date:</strong> ${dueDate}</p>
              <p><strong>Guests:</strong> ${guests}</p>
              <p><strong>Status:</strong> <span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 14px;">${status}</span></p>
              <p><strong>Products:</strong> ${
                products.length > 0
                  ? products
                      .map((p) => (typeof p === "object" ? p.name : p))
                      .join(", ")
                  : "To be confirmed"
              }</p>
              <p><strong>Address:</strong> ${address}</p>
              ${
                status === "completed" || status === "paid"
                  ? "<p><strong>Invoice:</strong> Generated and attached</p>"
                  : ""
              }
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">This booking was automatically registered in the system.</p>
          </div>
          
          <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 15px; color: #6b7280; font-size: 14px;">
            <p>📍 Lämmertwiete 2 21073 Hamburg, Germany | 📞 +4917622213135</p>
            <p>Dosa World Party Management System</p>
          </div>
        </div>
      `;

      // Professional customer email templates
      const customerBodies = {
        en: `
          <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); padding: 30px; border-radius: 16px; border: 1px solid #a7f3d0; max-width: 600px; margin: auto;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #10b981;">
              <img src="https://dosaworld.de/assets/logo-H7Hfdi3N.png" alt="Dosa World Logo" style="width: 120px; margin-bottom: 15px;">
              <h2 style="color: #047857; margin: 0; font-size: 28px;">🎉 Your Party is Confirmed!</h2>
              <p style="color: #059669; margin: 5px 0 0 0; font-size: 16px;">We're excited to host your celebration!</p>
            </div>

            <div style="padding: 25px; font-size: 16px;">
              <p>Dear <strong style="color: #065f46;">${customerName}</strong>,</p>
              <p>Thank you for choosing <strong style="color: #065f46;">Dosa World</strong> for your special celebration! Your party booking has been successfully confirmed and we're thrilled to be part of your event.</p>
              
              <div style="background: white; border: 2px solid #34d399; padding: 20px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.1);">
                <h3 style="color: #047857; margin-top: 0; text-align: center;">📋 Party Details</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <div><strong>Party Name:</strong></div><div>${partyName}</div>
                  <div><strong>Date:</strong></div><div>${dueDate}</div>
                  <div><strong>Guests:</strong></div><div>${guests} people</div>
                  <div><strong>Status:</strong></div><div><span style="background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 14px;">${status}</span></div>
                </div>
                <div style="margin-top: 15px;">
                  <strong>Products:</strong> ${
                    products.length > 0
                      ? products
                          .map((p) => (typeof p === "object" ? p.name : p))
                          .join(", ")
                      : "Our team will contact you to discuss menu options"
                  }
                </div>
                <div style="margin-top: 10px;">
                  <strong>Location:</strong> ${address}
                </div>
                ${
                  status === "completed" || status === "paid"
                    ? '<div style="margin-top: 15px; padding: 10px; background: #dbeafe; border-radius: 8px; text-align: center;">' +
                      "<strong>📄 Invoice:</strong> Your invoice has been generated and will be sent separately.</div>"
                    : ""
                }
              </div>

              <div style="background: #fffbeb; border: 1px solid #fcd34d; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #d97706; margin: 0;">📞 Next Steps</h4>
                <p style="margin: 10px 0 0 0;">Our event coordinator will contact you within 24 hours to discuss your preferences and finalize the details. Feel free to reach out to us anytime for special requests.</p>
              </div>

              <p>We're committed to making your celebration unforgettable with authentic flavors and exceptional service.</p>

              <p style="margin-top: 30px;">Warm regards,<br>
              <strong style="color: #047857; font-size: 18px;">The Dosa World Team</strong></p>
            </div>

            <div style="text-align: center; border-top: 2px solid #10b981; padding-top: 20px; font-size: 14px; color: #6b7280;">
              <p>📍 Lämmertwiete 2 21073 Hamburg, Germany</p>
              <p>📞 +4917622213135 | ✉️ info@dosaworld.com</p>
              <p>Follow us on 
                <a href="https://instagram.com/dosaworldhamburg" style="color: #059669; text-decoration: none; margin: 0 10px;">Instagram</a> • 
                <a href="https://facebook.com/DosaWorld.German" style="color: #059669; text-decoration: none; margin: 0 10px;">Facebook</a>
              </p>
            </div>
          </div>
        `,

        de: `
          <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); padding: 30px; border-radius: 16px; border: 1px solid #a7f3d0; max-width: 600px; margin: auto;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #10b981;">
              <img src="https://dosaworld.de/assets/logo-H7Hfdi3N.png" alt="Dosa World Logo" style="width: 120px; margin-bottom: 15px;">
              <h2 style="color: #047857; margin: 0; font-size: 28px;">🎉 Ihre Party wurde bestätigt!</h2>
              <p style="color: #059669; margin: 5px 0 0 0; font-size: 16px;">Wir freuen uns, Ihre Feier auszurichten!</p>
            </div>

            <div style="padding: 25px; font-size: 16px;">
              <p>Sehr geehrte/r <strong style="color: #065f46;">${customerName}</strong>,</p>
              <p>Vielen Dank, dass Sie sich für <strong style="color: #065f46;">Dosa World</strong> entschieden haben! Ihre Party-Buchung wurde erfolgreich bestätigt und wir freuen uns sehr, Teil Ihrer Veranstaltung zu sein.</p>
              
              <div style="background: white; border: 2px solid #34d399; padding: 20px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.1);">
                <h3 style="color: #047857; margin-top: 0; text-align: center;">📋 Party-Details</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <div><strong>Party Name:</strong></div><div>${partyName}</div>
                  <div><strong>Datum:</strong></div><div>${dueDate}</div>
                  <div><strong>Gäste:</strong></div><div>${guests} Personen</div>
                  <div><strong>Status:</strong></div><div><span style="background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 14px;">${status}</span></div>
                </div>
                <div style="margin-top: 15px;">
                  <strong>Produkte:</strong> ${
                    products.length > 0
                      ? products
                          .map((p) => (typeof p === "object" ? p.name : p))
                          .join(", ")
                      : "Unser Team wird Sie kontaktieren, um Menüoptionen zu besprechen"
                  }
                </div>
                <div style="margin-top: 10px;">
                  <strong>Ort:</strong> ${address}
                </div>
                ${
                  status === "completed" || status === "paid"
                    ? '<div style="margin-top: 15px; padding: 10px; background: #dbeafe; border-radius: 8px; text-align: center;">' +
                      "<strong>📄 Rechnung:</strong> Ihre Rechnung wurde erstellt und wird separat gesendet.</div>"
                    : ""
                }
              </div>

              <div style="background: #fffbeb; border: 1px solid #fcd34d; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #d97706; margin: 0;">📞 Nächste Schritte</h4>
                <p style="margin: 10px 0 0 0;">Unser Event-Koordinator wird Sie innerhalb von 24 Stunden kontaktieren, um Ihre Wünsche zu besprechen und die Details abzustimmen. Bei besonderen Wünschen können Sie uns jederzeit kontaktieren.</p>
              </div>

              <p>Wir sind bestrebt, Ihre Feier mit authentischen Aromen und außergewöhnlichem Service unvergesslich zu machen.</p>

              <p style="margin-top: 30px;">Mit herzlichen Grüßen,<br>
              <strong style="color: #047857; font-size: 18px;">Ihr Dosa World Team</strong></p>
            </div>

            <div style="text-align: center; border-top: 2px solid #10b981; padding-top: 20px; font-size: 14px; color: #6b7280;">
              <p>📍 Lämmertwiete 2 21073 Hamburg, Germany</p>
              <p>📞 +4917622213135 | ✉️ info@dosaworld.com</p>
              <p>Folgen Sie uns auf 
                <a href="https://instagram.com/dosaworldhamburg" style="color: #059669; text-decoration: none; margin: 0 10px;">Instagram</a> • 
                <a href="https://facebook.com/DosaWorld.German" style="color: #059669; text-decoration: none; margin: 0 10px;">Facebook</a>
              </p>
            </div>
          </div>
        `,
      };

      // Send admin email
      await sendMail({
        to: adminEmail,
        subject: subjects.admin,
        html: adminBody,
        text: `New party booking: ${partyName} for ${customerName}`,
      });

      console.log('invoicePdf == ', invoicePdf)

      // Handle invoice PDF storage if status is completed or paid
      if (invoicePdf && email) {
      try {
        const pdfBuffer = Buffer.from(
          invoicePdf.replace(/^data:application\/pdf;base64,/, ""),
          "base64"
        );

        await sendMail({
          to: email,
          subject: `Invoice for your party booking - ${partyName}`,
          html: `<p>Dear ${customerName},<br>Your invoice for the party booking is attached.</p>`,
          attachments: [
            {
              filename: `invoice_${newParty.id}.pdf`,
              content: pdfBuffer,
            },
          ],
        });

        console.log("✅ Invoice PDF sent directly to customer");
      } catch (pdfError) {
        console.error("❌ Error sending invoice PDF:", pdfError);
      }
    }

      // Send customer confirmation email
      if (email) {
        await sendMail({
          to: email,
          subject: subjects.customer[lang],
          html: customerBodies[lang],
          text: `Your party booking at Dosa World is confirmed for ${dueDate}`,
        });
      }

      res.status(201).json({
        success: true,
        message: "Party created successfully and confirmation emails sent",
        data: newParty,
      });
    } catch (error) {
      console.error("Error creating party:", error);
      res.status(500).json({
        success: false,
        message: "Error creating party",
        error: error.message,
      });
    }
  },

  // Update party with professional emails
  updateParty: async (req, res) => {
    try {
      const { id } = req.params;
      const { invoicePdf, ...updateData } = req.body;

      const existing = await PartyModel.getById(id);
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Party not found" });
      }

      const updatedParty = await PartyModel.update(id, updateData);
      const adminEmail = "dosaworldhamburg@gmail.com";
      const lang = detectLanguage(updateData.phone || existing.phone);

      const subjects = {
        admin: "Party Booking Updated - Dosa World",
        customer: {
          en: "Your Party Booking at Dosa World Has Been Updated",
          de: "Ihre Party-Buchung im Dosa World wurde aktualisiert",
        },
      };

      const adminBody = `
        <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 700px; margin: auto;">
          <div style="text-align: center; padding-bottom: 15px; border-bottom: 2px solid #f59e0b;">
            <h2 style="color: #d97706; margin: 0;">✏️ Party Booking Updated</h2>
          </div>
          
          <div style="padding: 20px; font-size: 16px; background: white; border-radius: 8px; margin: 15px 0;">
            <p>Party details have been updated at <strong style="color: #065f46;">Dosa World</strong>.</p>
            
            <div style="background: #fffbeb; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 15px 0;">
              <h3 style="color: #d97706; margin-top: 0;">Updated Party Details</h3>
              <p><strong>Party Name:</strong> ${updatedParty.partyName}</p>
              <p><strong>Customer Name:</strong> ${
                updatedParty.customerName
              }</p>
              <p><strong>Email:</strong> ${updatedParty.email || "N/A"}</p>
              <p><strong>Phone:</strong> ${updatedParty.phone}</p>
              <p><strong>Due Date:</strong> ${updatedParty.dueDate}</p>
              <p><strong>Guests:</strong> ${updatedParty.guests}</p>
              <p><strong>Status:</strong> <span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 12px; font-size: 14px;">${
                updatedParty.status
              }</span></p>
              <p><strong>Products:</strong> ${
                updatedParty.products.length > 0
                  ? updatedParty.products
                      .map((p) => (typeof p === "object" ? p.name : p))
                      .join(", ")
                  : "To be confirmed"
              }</p>
              <p><strong>Address:</strong> ${updatedParty.address}</p>
              ${
                (updatedParty.status === "completed" ||
                  updatedParty.status === "paid") &&
                invoicePdf
                  ? "<p><strong>Invoice:</strong> Updated and re-sent to customer</p>"
                  : ""
              }
            </div>
          </div>
        </div>
      `;

      const customerBodies = {
        en: `
          <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); padding: 30px; border-radius: 16px; border: 1px solid #fcd34d; max-width: 600px; margin: auto;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #f59e0b;">
              <img src="https://dosaworld.de/assets/logo-H7Hfdi3N.png" alt="Dosa World Logo" style="width: 120px; margin-bottom: 15px;">
              <h2 style="color: #d97706; margin: 0; font-size: 28px;">✏️ Booking Updated</h2>
              <p style="color: #b45309; margin: 5px 0 0 0; font-size: 16px;">Your party details have been updated</p>
            </div>

            <div style="padding: 25px; font-size: 16px;">
              <p>Dear <strong style="color: #065f46;">${
                updatedParty.customerName
              }</strong>,</p>
              <p>Your party booking at <strong style="color: #065f46;">Dosa World</strong> has been successfully updated with the following details:</p>
              
              <div style="background: white; border: 2px solid #f59e0b; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <h3 style="color: #d97706; margin-top: 0; text-align: center;">📋 Updated Party Details</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <div><strong>Party Name:</strong></div><div>${
                    updatedParty.partyName
                  }</div>
                  <div><strong>Date:</strong></div><div>${
                    updatedParty.dueDate
                  }</div>
                  <div><strong>Guests:</strong></div><div>${
                    updatedParty.guests
                  } people</div>
                  <div><strong>Status:</strong></div><div><span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 14px;">${
                    updatedParty.status
                  }</span></div>
                </div>
                <div style="margin-top: 15px;">
                  <strong>Products:</strong> ${
                    updatedParty.products.length > 0
                      ? updatedParty.products
                          .map((p) => (typeof p === "object" ? p.name : p))
                          .join(", ")
                      : "To be confirmed"
                  }
                </div>
                <div style="margin-top: 10px;">
                  <strong>Location:</strong> ${updatedParty.address}
                </div>
                ${
                  (updatedParty.status === "completed" ||
                    updatedParty.status === "paid") &&
                  invoicePdf
                    ? '<div style="margin-top: 15px; padding: 10px; background: #dbeafe; border-radius: 8px; text-align: center;">' +
                      "<strong>📄 Invoice:</strong> Your updated invoice has been generated and sent separately.</div>"
                    : ""
                }
              </div>

              <p>If you have any questions about these changes or need further assistance, please don't hesitate to contact us.</p>

              <p style="margin-top: 30px;">Warm regards,<br>
              <strong style="color: #047857; font-size: 18px;">The Dosa World Team</strong></p>
            </div>
          </div>
        `,

        de: `
          <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); padding: 30px; border-radius: 16px; border: 1px solid #fcd34d; max-width: 600px; margin: auto;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #f59e0b;">
              <img src="https://dosaworld.de/assets/logo-H7Hfdi3N.png" alt="Dosa World Logo" style="width: 120px; margin-bottom: 15px;">
              <h2 style="color: #d97706; margin: 0; font-size: 28px;">✏️ Buchung aktualisiert</h2>
              <p style="color: #b45309; margin: 5px 0 0 0; font-size: 16px;">Ihre Party-Details wurden aktualisiert</p>
            </div>

            <div style="padding: 25px; font-size: 16px;">
              <p>Sehr geehrte/r <strong style="color: #065f46;">${
                updatedParty.customerName
              }</strong>,</p>
              <p>Ihre Party-Buchung im <strong style="color: #065f46;">Dosa World</strong> wurde erfolgreich mit folgenden Details aktualisiert:</p>
              
              <div style="background: white; border: 2px solid #f59e0b; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <h3 style="color: #d97706; margin-top: 0; text-align: center;">📋 Aktualisierte Party-Details</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <div><strong>Party Name:</strong></div><div>${
                    updatedParty.partyName
                  }</div>
                  <div><strong>Datum:</strong></div><div>${
                    updatedParty.dueDate
                  }</div>
                  <div><strong>Gäste:</strong></div><div>${
                    updatedParty.guests
                  } Personen</div>
                  <div><strong>Status:</strong></div><div><span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 14px;">${
                    updatedParty.status
                  }</span></div>
                </div>
                <div style="margin-top: 15px;">
                  <strong>Produkte:</strong> ${
                    updatedParty.products.length > 0
                      ? updatedParty.products
                          .map((p) => (typeof p === "object" ? p.name : p))
                          .join(", ")
                      : "Noch zu bestätigen"
                  }
                </div>
                <div style="margin-top: 10px;">
                  <strong>Ort:</strong> ${updatedParty.address}
                </div>
                ${
                  (updatedParty.status === "completed" ||
                    updatedParty.status === "paid") &&
                  invoicePdf
                    ? '<div style="margin-top: 15px; padding: 10px; background: #dbeafe; border-radius: 8px; text-align: center;">' +
                      "<strong>📄 Rechnung:</strong> Ihre aktualisierte Rechnung wurde erstellt und separat gesendet.</div>"
                    : ""
                }
              </div>

              <p>Wenn Sie Fragen zu diesen Änderungen haben oder weitere Hilfe benötigen, zögern Sie bitte nicht, uns zu kontaktieren.</p>

              <p style="margin-top: 30px;">Mit herzlichen Grüßen,<br>
              <strong style="color: #047857; font-size: 18px;">Ihr Dosa World Team</strong></p>
            </div>
          </div>
        `,
      };

      // Send admin email
      await sendMail({
        to: adminEmail,
        subject: subjects.admin,
        html: adminBody,
        text: `Party updated: ${updatedParty.partyName}`,
      });

      const normalizedStatus = String(updatedParty.status).trim().toLowerCase();

      // Handle invoice PDF storage if status changed to completed or paid
      const statusChangedToPaidOrCompleted =
        (normalizedStatus === "completed" || normalizedStatus === "paid") &&
        invoicePdf;

      if (statusChangedToPaidOrCompleted) {
        try {
          const pdfBuffer = base64ToBuffer(invoicePdf);

          // Save PDF to database or file system
          await saveInvoicePDF(updatedParty.id, pdfBuffer);

          // Send invoice email to customer if email exists
          if (updatedParty.email) {
            await sendInvoiceEmail(
              updatedParty.email,
              updatedParty.customerName,
              updatedParty.id,
              pdfBuffer,
              lang
            );
          }

          // Also send copy to admin
          await sendInvoiceToAdmin(updatedParty, pdfBuffer);
        } catch (pdfError) {
          console.error("Error handling invoice PDF:", pdfError);
          // Don't fail the entire request if PDF handling fails
        }
      }

      // Send customer update email
      if (updatedParty.email) {
        await sendMail({
          to: updatedParty.email,
          subject: subjects.customer[lang],
          html: customerBodies[lang],
          text: `Your party booking at Dosa World has been updated`,
        });
      }

      res.json({
        success: true,
        message: "Party updated successfully and notification emails sent",
        data: updatedParty,
      });
    } catch (error) {
      console.error("Error updating party:", error);
      res.status(500).json({
        success: false,
        message: "Error updating party",
        error: error.message,
      });
    }
  },

  // Delete party with professional emails
  deleteParty: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await PartyModel.getById(id);
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Party not found" });
      }

      await PartyModel.delete(id);

      const adminEmail = "dosaworldhamburg@gmail.com";
      const lang = detectLanguage(existing.phone);

      const subjects = {
        admin: "Party Booking Canceled - Dosa World",
        customer: {
          en: "Your Party Booking at Dosa World Has Been Canceled",
          de: "Ihre Party-Buchung im Dosa World wurde storniert",
        },
      };

      const adminBody = `
        <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 700px; margin: auto;">
          <div style="text-align: center; padding-bottom: 15px; border-bottom: 2px solid #ef4444;">
            <h2 style="color: #dc2626; margin: 0;">❌ Party Booking Canceled</h2>
          </div>
          
          <div style="padding: 20px; font-size: 16px; background: white; border-radius: 8px; margin: 15px 0;">
            <p>Party booking has been canceled at <strong style="color: #065f46;">Dosa World</strong>.</p>
            
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 15px 0;">
              <h3 style="color: #dc2626; margin-top: 0;">Canceled Party Details</h3>
              <p><strong>Party Name:</strong> ${existing.partyName}</p>
              <p><strong>Customer Name:</strong> ${existing.customerName}</p>
              <p><strong>Email:</strong> ${existing.email || "N/A"}</p>
              <p><strong>Phone:</strong> ${existing.phone}</p>
              <p><strong>Due Date:</strong> ${existing.dueDate}</p>
              <p><strong>Guests:</strong> ${existing.guests}</p>
              <p><strong>Status:</strong> <span style="background: #fecaca; color: #991b1b; padding: 2px 8px; border-radius: 12px; font-size: 14px;">Canceled</span></p>
              <p><strong>Products:</strong> ${
                existing.products.length > 0
                  ? existing.products
                      .map((p) => (typeof p === "object" ? p.name : p))
                      .join(", ")
                  : "N/A"
              }</p>
              <p><strong>Address:</strong> ${existing.address}</p>
            </div>
          </div>
        </div>
      `;

      const customerBodies = {
        en: `
          <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 30px; border-radius: 16px; border: 1px solid #fca5a5; max-width: 600px; margin: auto;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #ef4444;">
              <img src="https://dosaworld.de/assets/logo-H7Hfdi3N.png" alt="Dosa World Logo" style="width: 120px; margin-bottom: 15px;">
              <h2 style="color: #dc2626; margin: 0; font-size: 28px;">❌ Booking Canceled</h2>
              <p style="color: #b91c1c; margin: 5px 0 0 0; font-size: 16px;">Your party booking has been canceled</p>
            </div>

            <div style="padding: 25px; font-size: 16px;">
              <p>Dear <strong style="color: #065f46;">${existing.customerName}</strong>,</p>
              <p>We regret to inform you that your party booking at <strong style="color: #065f46;">Dosa World</strong> has been canceled.</p>
              
              <div style="background: white; border: 2px solid #fca5a5; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <h3 style="color: #dc2626; margin-top: 0; text-align: center;">📋 Canceled Booking Details</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <div><strong>Party Name:</strong></div><div>${existing.partyName}</div>
                  <div><strong>Date:</strong></div><div>${existing.dueDate}</div>
                  <div><strong>Guests:</strong></div><div>${existing.guests} people</div>
                  <div><strong>Status:</strong></div><div><span style="background: #fecaca; color: #991b1b; padding: 4px 12px; border-radius: 20px; font-size: 14px;">Canceled</span></div>
                </div>
                <div style="margin-top: 10px;">
                  <strong>Location:</strong> ${existing.address}
                </div>
              </div>

              <div style="background: #fef3c7; border: 1px solid #fcd34d; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #d97706; margin: 0;">💡 We Hope to See You Soon</h4>
                <p style="margin: 10px 0 0 0;">We're sorry we couldn't host your celebration this time. We hope to have the opportunity to serve you in the future for another special occasion.</p>
              </div>

              <p>If this cancellation was unexpected or you have any questions, please feel free to contact us.</p>

              <p style="margin-top: 30px;">Warm regards,<br>
              <strong style="color: #047857; font-size: 18px;">The Dosa World Team</strong></p>
            </div>
          </div>
        `,

        de: `
          <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 30px; border-radius: 16px; border: 1px solid #fca5a5; max-width: 600px; margin: auto;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #ef4444;">
              <img src="https://dosaworld.de/assets/logo-H7Hfdi3N.png" alt="Dosa World Logo" style="width: 120px; margin-bottom: 15px;">
              <h2 style="color: #dc2626; margin: 0; font-size: 28px;">❌ Buchung storniert</h2>
              <p style="color: #b91c1c; margin: 5px 0 0 0; font-size: 16px;">Ihre Party-Buchung wurde storniert</p>
            </div>

            <div style="padding: 25px; font-size: 16px;">
              <p>Sehr geehrte/r <strong style="color: #065f46;">${existing.customerName}</strong>,</p>
              <p>Wir bedauern, Ihnen mitteilen zu müssen, dass Ihre Party-Buchung im <strong style="color: #065f46;">Dosa World</strong> storniert wurde.</p>
              
              <div style="background: white; border: 2px solid #fca5a5; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <h3 style="color: #dc2626; margin-top: 0; text-align: center;">📋 Stornierte Buchungsdetails</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <div><strong>Party Name:</strong></div><div>${existing.partyName}</div>
                  <div><strong>Datum:</strong></div><div>${existing.dueDate}</div>
                  <div><strong>Gäste:</strong></div><div>${existing.guests} Personen</div>
                  <div><strong>Status:</strong></div><div><span style="background: #fecaca; color: #991b1b; padding: 4px 12px; border-radius: 20px; font-size: 14px;">Storniert</span></div>
                </div>
                <div style="margin-top: 10px;">
                  <strong>Ort:</strong> ${existing.address}
                </div>
              </div>

              <div style="background: #fef3c7; border: 1px solid #fcd34d; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #d97706; margin: 0;">💡 Wir hoffen, Sie bald wiederzusehen</h4>
                <p style="margin: 10px 0 0 0;">Es tut uns leid, dass wir Ihre Feier diesmal nicht ausrichten konnten. Wir hoffen, Sie in Zukunft bei einem anderen besonderen Anlass begrüßen zu dürfen.</p>
              </div>

              <p>Falls diese Stornierung unerwartet kam oder Sie Fragen haben, zögern Sie bitte nicht, uns zu kontaktieren.</p>

              <p style="margin-top: 30px;">Mit herzlichen Grüßen,<br>
              <strong style="color: #047857; font-size: 18px;">Ihr Dosa World Team</strong></p>
            </div>
          </div>
        `,
      };

      await sendMail({
        to: adminEmail,
        subject: subjects.admin,
        html: adminBody,
        text: `Party canceled: ${existing.partyName}`,
      });

      if (existing.email) {
        await sendMail({
          to: existing.email,
          subject: subjects.customer[lang],
          html: customerBodies[lang],
          text: `Your party booking at Dosa World has been canceled`,
        });
      }

      res.json({
        success: true,
        message: "Party deleted successfully and notification emails sent",
      });
    } catch (error) {
      console.error("Error deleting party:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting party",
        error: error.message,
      });
    }
  },

  // Get overdue parties
  getOverdueParties: async (req, res) => {
    try {
      const overdueParties = await PartyModel.getOverdueParties();
      res.status(200).json({
        success: true,
        data: overdueParties,
        count: overdueParties.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching overdue parties",
        error: error.message,
      });
    }
  },

  // Update party status with professional emails
  updatePartyStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, invoicePdf } = req.body;

      if (!status) {
        return res
          .status(400)
          .json({ success: false, message: "Status is required" });
      }

      const validStatuses = [
        "registered",
        "advance paid",
        "paid",
        "unpaid",
        "completed",
      ];
      if (!validStatuses.includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid status" });
      }

      const party = await PartyModel.updateStatus(id, status);
      if (!party) {
        return res
          .status(404)
          .json({ success: false, message: "Party not found" });
      }

      const adminEmail = "dosaworldhamburg@gmail.com";
      const lang = detectLanguage(party.phone);

      const normalizedStatus = String(status).trim().toLowerCase();

      // Handle invoice PDF storage if status changed to completed or paid
      if (
        (normalizedStatus === "completed" || normalizedStatus === "paid") &&
        invoicePdf
      ) {
        try {
          const pdfBuffer = base64ToBuffer(invoicePdf);

          // Save PDF to database or file system
          await saveInvoicePDF(party.id, pdfBuffer);

          console.log("party.email, ", party.email);
          console.log("party.customerName, ", party.customerName);
          console.log("party.id, ", party.id);
          console.log("pdfBuffer, ", pdfBuffer);
          console.log("lang, ", lang);

          // Send invoice email to customer if email exists
          if (party.email) {
            await sendInvoiceEmail(
              party.email,
              party.customerName,
              party.id,
              pdfBuffer,
              lang
            );
          }

          // Also send copy to admin
          await sendInvoiceToAdmin(party, pdfBuffer);
        } catch (pdfError) {
          console.error("Error handling invoice PDF:", pdfError);
          // Don't fail the entire request if PDF handling fails
        }
      }

      // Status-specific email configurations
      const statusConfigs = {
        registered: {
          adminColor: "#10b981",
          customerColor: "#047857",
          adminIcon: "📝",
          customerIcon: "📝",
          adminTitle: "Party Registration Confirmed",
          customerTitles: {
            en: "Registration Confirmed",
            de: "Registrierung bestätigt",
          },
          customerMessages: {
            en: "Your party registration has been confirmed and we're preparing for your event.",
            de: "Ihre Party-Registrierung wurde bestätigt und wir bereiten uns auf Ihre Veranstaltung vor.",
          },
        },
        "advance paid": {
          adminColor: "#f59e0b",
          customerColor: "#d97706",
          adminIcon: "💰",
          customerIcon: "💳",
          adminTitle: "Advance Payment Received",
          customerTitles: {
            en: "Advance Payment Received",
            de: "Anzahlung erhalten",
          },
          customerMessages: {
            en: "We've received your advance payment and your booking is now secured.",
            de: "Wir haben Ihre Anzahlung erhalten und Ihre Buchung ist nun gesichert.",
          },
        },
        paid: {
          adminColor: "#10b981",
          customerColor: "#047857",
          adminIcon: "✅",
          customerIcon: "🎉",
          adminTitle: "Full Payment Received",
          customerTitles: {
            en: "Payment Complete - Ready to Celebrate!",
            de: "Zahlung abgeschlossen - Bereit zum Feiern!",
          },
          customerMessages: {
            en: "Your payment is complete and everything is ready for your celebration!",
            de: "Ihre Zahlung ist abgeschlossen und alles ist bereit für Ihre Feier!",
          },
        },
        unpaid: {
          adminColor: "#ef4444",
          customerColor: "#dc2626",
          adminIcon: "⚠️",
          customerIcon: "💳",
          adminTitle: "Payment Pending",
          customerTitles: {
            en: "Payment Reminder",
            de: "Zahlungserinnerung",
          },
          customerMessages: {
            en: "Please complete your payment to secure your party booking.",
            de: "Bitte schließen Sie Ihre Zahlung ab, um Ihre Party-Buchung zu sichern.",
          },
        },
        completed: {
          adminColor: "#6366f1",
          customerColor: "#4f46e5",
          adminIcon: "🎊",
          customerIcon: "⭐",
          adminTitle: "Party Successfully Completed",
          customerTitles: {
            en: "Thank You for Celebrating With Us!",
            de: "Vielen Dank für Ihre Feier bei uns!",
          },
          customerMessages: {
            en: "Your party has been successfully completed. Thank you for choosing Dosa World!",
            de: "Ihre Party wurde erfolgreich abgeschlossen. Vielen Dank, dass Sie Dosa World gewählt haben!",
          },
        },
      };

      const config = statusConfigs[status];

      // Admin email
      const adminBody = `
        <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 700px; margin: auto;">
          <div style="text-align: center; padding-bottom: 15px; border-bottom: 2px solid ${
            config.adminColor
          };">
            <h2 style="color: ${config.adminColor}; margin: 0;">${
        config.adminIcon
      } ${config.adminTitle}</h2>
          </div>
          
          <div style="padding: 20px; font-size: 16px; background: white; border-radius: 8px; margin: 15px 0;">
            <p>Party status has been updated to <strong style="color: ${
              config.adminColor
            };">${status}</strong> at <strong style="color: #065f46;">Dosa World</strong>.</p>
            
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid ${
              config.adminColor
            }; margin: 15px 0;">
              <h3 style="color: ${
                config.adminColor
              }; margin-top: 0;">Party Details</h3>
              <p><strong>Party Name:</strong> ${party.partyName}</p>
              <p><strong>Customer Name:</strong> ${party.customerName}</p>
              <p><strong>Email:</strong> ${party.email || "N/A"}</p>
              <p><strong>Phone:</strong> ${party.phone}</p>
              <p><strong>Due Date:</strong> ${party.dueDate}</p>
              <p><strong>Guests:</strong> ${party.guests}</p>
              <p><strong>New Status:</strong> <span style="background: ${
                config.adminColor
              }20; color: ${
        config.adminColor
      }; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: bold;">${status}</span></p>
              <p><strong>Address:</strong> ${party.address}</p>
              ${
                (status === "completed" || status === "paid") && invoicePdf
                  ? "<p><strong>Invoice:</strong> Generated and sent to customer</p>"
                  : ""
              }
            </div>
          </div>
        </div>
      `;

      // Customer email templates
      const customerBodies = {
        en: `
          <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px; border-radius: 16px; border: 2px solid ${
            config.customerColor
          }; max-width: 600px; margin: auto;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid ${
              config.customerColor
            };">
              <img src="https://dosaworld.de/assets/logo-H7Hfdi3N.png" alt="Dosa World Logo" style="width: 120px; margin-bottom: 15px;">
              <h2 style="color: ${
                config.customerColor
              }; margin: 0; font-size: 28px;">${config.customerIcon} ${
          config.customerTitles.en
        }</h2>
              <p style="color: ${
                config.customerColor
              }; margin: 5px 0 0 0; font-size: 16px;">Party: ${
          party.partyName
        }</p>
            </div>

            <div style="padding: 25px; font-size: 16px;">
              <p>Dear <strong style="color: #065f46;">${
                party.customerName
              }</strong>,</p>
              <p>${config.customerMessages.en}</p>
              
              <div style="background: white; border: 2px solid ${
                config.customerColor
              }; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <h3 style="color: ${
                  config.customerColor
                }; margin-top: 0; text-align: center;">📋 Current Status</h3>
                <div style="text-align: center; margin: 15px 0;">
                  <span style="background: ${config.customerColor}20; color: ${
          config.customerColor
        }; padding: 8px 20px; border-radius: 25px; font-size: 18px; font-weight: bold; display: inline-block;">
                    ${config.customerIcon} ${status.toUpperCase()}
                  </span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                  <div><strong>Party Name:</strong></div><div>${
                    party.partyName
                  }</div>
                  <div><strong>Date:</strong></div><div>${party.dueDate}</div>
                  <div><strong>Guests:</strong></div><div>${
                    party.guests
                  } people</div>
                </div>
                ${
                  (status === "completed" || status === "paid") && invoicePdf
                    ? '<div style="margin-top: 15px; padding: 10px; background: #dbeafe; border-radius: 8px; text-align: center;">' +
                      "<strong>📄 Invoice:</strong> Your invoice has been generated and sent separately.</div>"
                    : ""
                }
              </div>

              ${
                status === "completed"
                  ? `
                <div style="background: #f0fdf4; border: 1px solid #34d399; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="color: #047857; margin: 0;">⭐ Share Your Experience</h4>
                  <p style="margin: 10px 0 0 0;">We hope you enjoyed your celebration with us! We'd love to hear about your experience on Google Reviews or social media.</p>
                </div>
              `
                  : ""
              }

              ${
                status === "unpaid"
                  ? `
                <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="color: #d97706; margin: 0;">💳 Complete Your Payment</h4>
                  <p style="margin: 10px 0 0 0;">Please contact us to arrange payment and secure your booking. We accept various payment methods for your convenience.</p>
                </div>
              `
                  : ""
              }

              <p>If you have any questions about your booking status, please don't hesitate to contact us.</p>

              <p style="margin-top: 30px;">Warm regards,<br>
              <strong style="color: #047857; font-size: 18px;">The Dosa World Team</strong></p>
            </div>
          </div>
        `,

        de: `
          <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px; border-radius: 16px; border: 2px solid ${
            config.customerColor
          }; max-width: 600px; margin: auto;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid ${
              config.customerColor
            };">
              <img src="https://dosaworld.de/assets/logo-H7Hfdi3N.png" alt="Dosa World Logo" style="width: 120px; margin-bottom: 15px;">
              <h2 style="color: ${
                config.customerColor
              }; margin: 0; font-size: 28px;">${config.customerIcon} ${
          config.customerTitles.de
        }</h2>
              <p style="color: ${
                config.customerColor
              }; margin: 5px 0 0 0; font-size: 16px;">Party: ${
          party.partyName
        }</p>
            </div>

            <div style="padding: 25px; font-size: 16px;">
              <p>Sehr geehrte/r <strong style="color: #065f46;">${
                party.customerName
              }</strong>,</p>
              <p>${config.customerMessages.de}</p>
              
              <div style="background: white; border: 2px solid ${
                config.customerColor
              }; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <h3 style="color: ${
                  config.customerColor
                }; margin-top: 0; text-align: center;">📋 Aktueller Status</h3>
                <div style="text-align: center; margin: 15px 0;">
                  <span style="background: ${config.customerColor}20; color: ${
          config.customerColor
        }; padding: 8px 20px; border-radius: 25px; font-size: 18px; font-weight: bold; display: inline-block;">
                    ${config.customerIcon} ${status.toUpperCase()}
                  </span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                  <div><strong>Party Name:</strong></div><div>${
                    party.partyName
                  }</div>
                  <div><strong>Datum:</strong></div><div>${party.dueDate}</div>
                  <div><strong>Gäste:</strong></div><div>${
                    party.guests
                  } Personen</div>
                </div>
                ${
                  (status === "completed" || status === "paid") && invoicePdf
                    ? '<div style="margin-top: 15px; padding: 10px; background: #dbeafe; border-radius: 8px; text-align: center;">' +
                      "<strong>📄 Rechnung:</strong> Ihre Rechnung wurde erstellt und separat gesendet.</div>"
                    : ""
                }
              </div>

              ${
                status === "completed"
                  ? `
                <div style="background: #f0fdf4; border: 1px solid #34d399; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="color: #047857; margin: 0;">⭐ Teilen Sie Ihre Erfahrung</h4>
                  <p style="margin: 10px 0 0 0;">Wir hoffen, Sie haben Ihre Feier bei uns genossen! Wir würden uns freuen, von Ihren Erfahrungen in Google-Bewertungen oder sozialen Medien zu hören.</p>
                </div>
              `
                  : ""
              }

              ${
                status === "unpaid"
                  ? `
                <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="color: #d97706; margin: 0;">💳 Zahlung abschließen</h4>
                  <p style="margin: 10px 0 0 0;">Bitte kontaktieren Sie uns, um die Zahlung zu arrangieren und Ihre Buchung zu sichern. Wir akzeptieren verschiedene Zahlungsmethoden für Ihre Bequemlichkeit.</p>
                </div>
              `
                  : ""
              }

              <p>Wenn Sie Fragen zu Ihrem Buchungsstatus haben, zögern Sie bitte nicht, uns zu kontaktieren.</p>

              <p style="margin-top: 30px;">Mit herzlichen Grüßen,<br>
              <strong style="color: #047857; font-size: 18px;">Ihr Dosa World Team</strong></p>
            </div>
          </div>
        `,
      };

      // Send admin email
      await sendMail({
        to: adminEmail,
        subject: `Party Status Updated to ${status} - Dosa World`,
        html: adminBody,
        text: `Party status updated to ${status} for ${party.partyName}`,
      });

      // Send customer email if email exists
      if (party.email) {
        await sendMail({
          to: party.email,
          subject: config.customerTitles[lang] + " - Dosa World",
          html: customerBodies[lang],
          text: `Your party status has been updated to ${status}`,
        });
      }

      res.json({
        success: true,
        message: `Party status updated to ${status} and notification emails sent`,
        data: party,
      });
    } catch (error) {
      console.error("Error updating party status:", error);
      res.status(500).json({
        success: false,
        message: "Error updating party status",
        error: error.message,
      });
    }
  },
};

module.exports = PartyController;
