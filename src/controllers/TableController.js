const TableModel = require("../models/TableModel");

exports.getAll = async (req, res) => {
  try {
    const results = await TableModel.getAll();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await TableModel.getById(req.params.id);
    if (!result) return res.status(404).json({ message: "Table not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await TableModel.create(req.body);
    res.json({ message: "Table created", table: result });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await TableModel.update(req.params.id, req.body);
    res.json({ message: "Table updated", table: result });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};

exports.delete = async (req, res) => {
  try {
    const success = await TableModel.delete(req.params.id);
    if (!success) return res.status(404).json({ message: "Table not found" });
    res.json({ message: "Table deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
};
