// utils/sftpUpload.js
const Client = require("ssh2-sftp-client");
const path = require("path");

const sftp = new Client();

const SFTP_HOST = "31.97.36.171";
const SFTP_USER = "root";
const SFTP_PASSWORD = "Dosa@world2025";
const SFTP_BASE_PATH = "/var/www/dosaworld-frontend/dist/uploads/categories";

async function uploadToFTP(file) {
  try {
    // Connect
    await sftp.connect({
      host: SFTP_HOST,
      port: 22,
      username: SFTP_USER,
      password: SFTP_PASSWORD,
    });

    // Ensure category folder exists
    try {
      await sftp.stat(SFTP_BASE_PATH);
    } catch (err) {
      await sftp.mkdir(SFTP_BASE_PATH, true); 
    }

    // Generate unique filename
    const remoteFilename = `${Date.now()}-${file.originalname}`;

    // Build path (posix for SFTP correctness)
    const remoteFilePath = path.posix.join(SFTP_BASE_PATH, remoteFilename);

    // Upload buffer
    await sftp.put(file.buffer, remoteFilePath);

    // Build public URL
    const fileUrl = `https://dosaworld.de/uploads/categories/${remoteFilename}`;

    console.log("Uploaded File URL:", fileUrl);
    return fileUrl;

  } catch (err) {
    console.error("SFTP Upload Error:", err);
    throw err;
  } finally {
    await sftp.end();
  }
}

module.exports = uploadToFTP;
