// utils/ftpUpload.js
const ftp = require("basic-ftp");
const path = require("path");
const { Readable } = require("stream");

async function uploadToFTP(file) {
  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host: 'ftp.kritatechnosolutions.com',
      user: 'u180373631.dosaworldadmin',
      password: 'Dosa@2025!wd',
      secure: false, // set true if your host requires FTPS
    });

    // Ensure the directory exists on FTP
    const remoteDir = "/uploads/categories";
    await client.ensureDir(remoteDir);
    await client.cd(remoteDir);

    // Convert buffer to readable stream
    const stream = new Readable();
    stream.push(file.buffer); // push buffer
    stream.push(null); // end of stream

    // Prepend timestamp to avoid name conflicts
    const remoteFilename = `${Date.now()}-${file.originalname}`;

    // Upload
    await client.uploadFrom(stream, remoteFilename);

    // Return public URL
    const fileUrl = `https://dosaworld.de/uploads/categories/${remoteFilename}`;
    console.log("Uploaded file URL:", fileUrl);
    return fileUrl;

  } catch (err) {
    console.error("FTP Upload Error:", err);
    throw err;
  } finally {
    client.close();
  }
}

module.exports = uploadToFTP;
