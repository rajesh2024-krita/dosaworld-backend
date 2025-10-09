const ftp = require("basic-ftp");
const path = require("path");
const { Readable } = require("stream");

const FTP_HOST = "ftp.kritatechnosolutions.com";
const FTP_USER = "u180373631.dosaworldadmin";
const FTP_PASSWORD = "Dosa@2025!wd";
const FTP_BASE_PATH = "/uploads/OfferImages"; // base folder on FTP

/**
 * Upload a file or create a folder on FTP
 * @param {Object|null} file - file object from multer (buffer-based)
 * @param {string|null} folderName - folder name to create (optional)
 * @returns {Promise<string>} - returns remote file path if uploaded
 */
async function ftpOffer(file = null, folderName = null) {
    const client = new ftp.Client();
    client.ftp.verbose = true; // optional logging

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
            // Convert buffer to readable stream
            const stream = new Readable();
            stream.push(file.buffer); // push buffer
            stream.push(null); // end of stream

            // Optional: prepend timestamp to avoid name conflicts
            const remotePath = path.posix.join(
                FTP_BASE_PATH,
                `${Date.now()}-${file.originalname}`
            );

            await client.uploadFrom(stream, remotePath);
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
