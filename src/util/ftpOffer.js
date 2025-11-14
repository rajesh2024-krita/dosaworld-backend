const Client = require("ssh2-sftp-client");
const path = require("path");

const sftp = new Client();

const SFTP_HOST = "31.97.36.171";
const SFTP_USER = "root";
const SFTP_PASSWORD = "Dosa@world2025";
const SFTP_BASE_PATH = "/var/www/dosaworld-frontend/dist/uploads/OfferImages"; // inside chroot

async function ftpOffer(file = null, folderName = null) {
    await sftp.connect({
        host: SFTP_HOST,
        username: SFTP_USER,
        password: SFTP_PASSWORD,
    });

    try {
        if (folderName) {
            const folderPath = path.posix.join(SFTP_BASE_PATH, folderName);
            await sftp.mkdir(folderPath, true);
            return folderPath;
        }

        if (file) {
            const remoteFilePath = path.posix.join(
                SFTP_BASE_PATH,
                `${Date.now()}-${file.originalname}`
            );

            await sftp.put(file.buffer, remoteFilePath);

            return remoteFilePath;
        }

        throw new Error("file or folderName is required");
    } catch (err) {
        console.error("SFTP Error:", err);
        throw err;
    } finally {
        await sftp.end();
    }
}

module.exports = { ftpOffer };
