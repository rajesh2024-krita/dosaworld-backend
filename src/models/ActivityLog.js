const db = require("../config/db");

class ActivityLogModel {
  static async getAll() {
    const [rows] = await db.query(
      `SELECT l.id, l.userId, u.name as actorName, l.action, l.description,
              l.ipAddress, l.userAgent, l.targetType, l.targetId, l.createdAt as timestamp
       FROM rbac_activity_logs l
       JOIN rbac_users u ON l.userId = u.id
       ORDER BY l.createdAt DESC`
    );
    return rows;
  }

  static async create(log) {
    const [result] = await db.query(
      `INSERT INTO rbac_activity_logs
      (userId, action, description, ipAddress, userAgent, targetType, targetId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        log.userId,
        log.action,
        log.description,
        log.ipAddress || null,
        log.userAgent || null,
        log.targetType || null,
        log.targetId || null,
      ]
    );
    return result;
  }
}

module.exports = ActivityLogModel;
