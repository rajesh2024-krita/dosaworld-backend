const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");

const FTP_HOST = "ftp.kritatechnosolutions.com";
const FTP_USER = "u180373631.dosaworldadmin";
const FTP_PASSWORD = "Dosa@2025!wd";
const FTP_BASE_PATH = "/uploads/OfferImages"; // base folder on FTP

/**
 * Upload a file or create a folder on FTP
 * @param {Object|null} file - file object from multer (if uploading file)
 * @param {string|null} folderName - folder name to create (if creating folder)
 * @returns {Promise<string>} - returns remote file path if uploaded
 */
async function ftpOffer(file = null, folderName = null) {
    const client = new ftp.Client();
    client.ftp.verbose = true; // for logging, optional

    try {
        await client.access({
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASSWORD,
            secure: false, // true if using FTPS
        });

        if (folderName) {
            // Create folder for bucket
            const folderPath = path.posix.join(FTP_BASE_PATH, folderName);
            await client.ensureDir(folderPath);
            await client.cd("/"); // reset to root
            console.log(`Folder created: ${folderPath}`);
            return folderPath;
        }

        if (file) {
            const remotePath = path.posix.join(FTP_BASE_PATH, file.originalname);
            await client.uploadFrom(file.path, remotePath);
            console.log(`File uploaded: ${remotePath}`);
            return remotePath;
        }

        throw new Error("Either file or folderName must be provided");
    } catch (err) {
        console.error("FTP Error:", err);
        throw err;
    } finally {
        client.close();
    }
}

module.exports = { ftpOffer };
