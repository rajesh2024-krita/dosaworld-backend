const cron = require("node-cron");
const sendMail = require("../util/mail");
const { getFilteredBillings } = require("../models/BillingModel");

// Schedule task: every day at 23:50 (11:50 PM)
cron.schedule("50 23 * * *", async () => {
  console.log("🕚 Preparing EOD report...");

  try {
    // Define the period: yesterday
    const to = new Date();
    to.setHours(23, 50, 0, 0); // today 23:50

    const from = new Date(to);
    from.setDate(from.getDate() - 1); // yesterday

    console.log("⏱ Report period:");
    console.log("From:", from.toISOString());
    console.log("To  :", to.toISOString());

    // Fetch billing data for the period
    const billings = await getFilteredBillings(from.toISOString(), to.toISOString());

    let emailHtml;

    if (billings.length > 0) {
      // Create HTML table rows safely
      const rows = billings
        .map(
          (b) => `
            <tr>
              <td>${new Date(b.date).toLocaleDateString()}</td>
              <td>${b.handledBy || ''}</td>
              <td style="text-align:right;">${Number(b.card || 0).toFixed(2)}</td>
              <td style="text-align:right;">${Number(b.cash || 0).toFixed(2)}</td>
              <td style="text-align:right;">${Number(b.trinkgeld || 0).toFixed(2)}</td>
              <td style="text-align:right;">${Number(b.trinkgeldBar || 0).toFixed(2)}</td>
              <td style="text-align:right; font-weight:bold;">${Number(b.paid || 0).toFixed(2)}</td>
            </tr>
          `
        )
        .join("");

      // Calculate totals safely
      const totalCard = billings.reduce((sum, b) => sum + Number(b.card || 0), 0).toFixed(2);
      const totalCash = billings.reduce((sum, b) => sum + Number(b.cash || 0), 0).toFixed(2);
      const totalTrinkgeld = billings.reduce((sum, b) => sum + Number(b.trinkgeld || 0), 0).toFixed(2);
      const totalTrinkgeldBar = billings.reduce((sum, b) => sum + Number(b.trinkgeldBar || 0), 0).toFixed(2);
      const totalPaid = billings.reduce((sum, b) => sum + Number(b.paid || 0), 0).toFixed(2);

      // Professional HTML email
      emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; line-height: 1.5;">
          <p>Dear Founder of Dosa World,</p>
          <p>Please find below the End of Day (EOD) billing report for <strong>${to.toLocaleDateString()}</strong>.</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #15803d; color: white; text-align:left;">
                <th style="padding: 8px; border: 1px solid #ddd;">Date</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Handled By</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align:right;">Card (€)</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align:right;">Cash (€)</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align:right;">Trinkgeld (€)</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align:right;">Trinkgeld Bar (€)</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align:right;">Paid (€)</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
              <tr style="font-weight:bold; background-color:#f3f4f6;">
                <td colspan="2" style="padding:8px; border:1px solid #ddd;">Total</td>
                <td style="text-align:right; padding:8px; border:1px solid #ddd;">${totalCard}</td>
                <td style="text-align:right; padding:8px; border:1px solid #ddd;">${totalCash}</td>
                <td style="text-align:right; padding:8px; border:1px solid #ddd;">${totalTrinkgeld}</td>
                <td style="text-align:right; padding:8px; border:1px solid #ddd;">${totalTrinkgeldBar}</td>
                <td style="text-align:right; padding:8px; border:1px solid #ddd;">${totalPaid}</td>
              </tr>
            </tbody>
          </table>

          <p style="margin-top: 20px;">All amounts have been verified and submitted for your review.</p>
          <p>Regards,<br/><strong>Dosa World Restaurant</strong></p>
        </div>
      `;
    } else {  
      emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; line-height: 1.5;">
          <p>Dear Founder of Dosa World,</p>
          <p>There are no billing records for <strong>${to.toLocaleDateString()}</strong>.</p>
          <p>Regards,<br/><strong>Dosa World Restaurant</strong></p>
        </div>
      `;
    }

    // Send email
    await sendMail({
      to: "buvanesh.kritatechnosolutions@gmail.com",
      subject: `Dosa World End Of The Day Billing Report - ${new Date().toLocaleDateString()}`,
      html: emailHtml,
    });

    console.log("✅ EOD report processed and email sent!");
  } catch (err) {
    console.error("❌ Failed to process EOD report:", err.message);
  }
});
