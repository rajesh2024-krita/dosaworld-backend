// utils/ftpUpload.js
const ftp = require("basic-ftp");
const path = require("path");

async function uploadToFTP(file) {
  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host: 'ftp.kritatechnosolutions.com',
      user: 'u180373631.dosaworldadmin',
      password: 'u180373631.dosaworldadmin',
      secure: false, // set true if your host requires FTPS
    });

    // Ensure the directory exists on FTP
    await client.ensureDir("/uploads/categories");
    await client.cd("/uploads/categories");

    
    // Upload the file
    await client.uploadFrom(file.path, file.filename);
    
    // Public URL
    const fileUrl = `https://dosaworldadmin.kritatechnosolutions.com/uploads/categories/${file.filename}`;
    console.log(fileUrl)
    return fileUrl;
  } catch (err) {
    console.error("FTP Upload Error:", err);
    throw err;
  } finally {
    client.close();
  }
}

module.exports = uploadToFTP;
