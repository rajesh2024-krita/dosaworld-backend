const cron = require("node-cron");
const sendMail = require("../util/mail");
const { getFilteredBillings } = require("../models/BillingModel");

// Schedule task: every day at 23:50 (11:50 PM)
cron.schedule("50 23 * * *", async () => {
  console.log("🕚 Preparing EOD report...");

  try {
    // Define the period: last 30 days
    const to = new Date();
    to.setHours(23, 50, 0, 0); // today 23:50

    const from = new Date(to);
    from.setDate(from.getDate() - 1); // 30 days ago

    console.log("⏱ Report period:");
    console.log("From:", from.toISOString());
    console.log("To  :", to.toISOString());

    // Fetch billing data for the period
    const billings = await getFilteredBillings(from.toISOString(), to.toISOString());

    let emailHtml;

    if (billings.length > 0) {
      // Create HTML table for the report
      const rows = billings
        .map(
          (b) =>
            `<tr>
              <td>${new Date(b.date).toLocaleDateString()}</td>
              <td>${b.handledBy}</td>
              <td>${b.card}</td>
              <td>${b.cash}</td>
              <td>${b.trinkgeld}</td>
              <td>${b.trinkgeldBar}</td>
              <td>${b.paid}</td>
            </tr>`
        )
        .join("");

      emailHtml = `
        <h2>EOD Billing Report</h2>
        <p>Period: ${from.toLocaleDateString()} - ${to.toLocaleDateString()}</p>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
          <thead>
            <tr>
              <th>Date</th>
              <th>Handled By</th>
              <th>Card</th>
              <th>Cash</th>
              <th>Trinkgeld</th>
              <th>TrinkgeldBar</th>
              <th>Paid</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
    } else {
      emailHtml = `<p>No EOD Report is updated for this period.</p>`;
    }

    // Send email
    await sendMail({
      to: "buvanesh.kritatechnosolutions@gmail.com",
      subject: `EOD Billing Report - ${new Date().toLocaleDateString()}`,
      html: emailHtml,
    });

    console.log("✅ EOD report processed and email sent!");
  } catch (err) {
    console.error("❌ Failed to process EOD report:", err.message);
  }
});
