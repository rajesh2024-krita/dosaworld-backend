import pool from "../config/db.js"

export const getAll = async () => {
  const [rows] = await pool.query("SELECT * FROM TimeSlots ORDER BY start_time ASC")
  return rows
}

export const create = async ({ start_time, end_time }) => {
  const [result] = await pool.query(
    "INSERT INTO TimeSlots (start_time, end_time) VALUES (?, ?)",
    [start_time, end_time]
  )
  return { id: result.insertId, start_time, end_time }
}

export const update = async (id, { start_time, end_time }) => {
  await pool.query("UPDATE TimeSlots SET start_time=?, end_time=? WHERE id=?", [
    start_time,
    end_time,
    id,
  ])
  return { id, start_time, end_time }
}

export const remove = async (id) => {
  await pool.query("DELETE FROM TimeSlots WHERE id=?", [id])
  return { message: "Deleted successfully" }
}
