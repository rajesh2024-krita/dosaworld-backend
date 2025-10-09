// middleware/upload.js
const multer = require("multer");

// store files in memory as buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
