// middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const tempPath = path.join(process.cwd(), "uploads/tmp");
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempPath); // save temporarily
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
module.exports = upload;
