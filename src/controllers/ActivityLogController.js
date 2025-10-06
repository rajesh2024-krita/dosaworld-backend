const ActivityLogModel = require("../models/ActivityLog");
const { Parser: Json2CsvParser } = require("json2csv");

const getLogs = async (req, res) => {
  try {
    const logs = await ActivityLogModel.getAll();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activity logs", err });
  }
};

const addLog = async (req, res) => {
  try {
    const log = req.body;
    const result = await ActivityLogModel.create(log);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const exportLogs = async (req, res) => {
  try {
    const format = req.query.format || "json";
    const logs = await ActivityLogModel.getAll();

    if (format === "csv") {
      const fields = [
        "id",
        "userId",
        "actorName",
        "action",
        "description",
        "ipAddress",
        "userAgent",
        "targetType",
        "targetId",
        "createdAt",
      ];
      const json2csv = new Json2CsvParser({ fields });
      const csv = json2csv.parse(logs);

      res.header("Content-Type", "text/csv");
      res.attachment("activity-logs.csv");
      return res.send(csv);
    }

    res.header("Content-Type", "application/json");
    res.attachment("activity-logs.json");
    return res.send(JSON.stringify(logs, null, 2));
  } catch (err) {
    res.status(500).json({ error: "Failed to export logs" });
  }
};

module.exports = {
  getLogs,
  addLog,
  exportLogs,
};
