const cron = require("node-cron");
const sendMail = require("../util/mail");
const { getAllBillings } = require("../models/BillingModel");

// Schedule task: every day at 23:50 (11:50 PM)
cron.schedule("30 18 * * *", async () => {
  console.log("🕚 Preparing EOD report...");

  try {
    // Define the 24-hour window: yesterday 23:50 to today 23:50
    const to = new Date();
    to.setHours(23, 50, 0, 0); // today 23:50

    const from = new Date(to);
    from.setDate(from.getDate() - 1); // yesterday 23:50

    console.log("⏱ Report period:");
    console.log("From:", from.toISOString());
    console.log("To  :", to.toISOString());

    // Fetch billing data for the period
    const billings = await getfilteredBillings(from.toISOString(), to.toISOString());

    // Format report: show card, cash, trinkgeld, trinkgeldBar, paid, handledBy, date
    const report = billings.length
      ? billings
          .map(
            (b) =>
              `Date: ${new Date(b.date).toLocaleString()}, Handled By: ${b.handledBy}, Card: ${b.card}, Cash: ${b.cash}, Trinkgeld: ${b.trinkgeld}, TrinkgeldBar: ${b.trinkgeldBar}, Paid: ${b.paid}`
          )
          .join("\n")
      : "No billings in this period";

    // ✅ Check report in console before sending mail
    console.log("📄 EOD Report Content:\n", report);

    // Uncomment this section to send email after verifying the report
    /*
    await sendMail({
      to: "buvanesh.kritatechnosolutions@gmail.com",
      subject: `EOD Billing Report - ${new Date().toLocaleDateString()}`,
      text: report,
    });
    */

    console.log("✅ EOD report processed!");
  } catch (err) {
    console.error("❌ Failed to process EOD report:", err.message);
  }
});
