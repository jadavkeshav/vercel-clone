const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
const Redis = require("ioredis");
require('dotenv').config();

//create Redis client
const publisher = new Redis(process.env.REDIS_URL);

//create an S3 client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const PROJECT_ID = process.env.PROJECT_ID;

function publishLogs(log) {
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({ log }));
}

async function init() {
    console.log("Executing Script.js");
    publishLogs("Build Started...");
    const outDirPath = path.join(__dirname, "output");
    console.log("Output Directory Path: ", outDirPath);

    //setting the output directory as dist
    const p = exec(`cd ${outDirPath} && npm install &&  npm run build`);

    //when the command is running we can see the output in the console
    p.stdout.on("data", (data) => {
        console.log(data.toString());
        publishLogs(data.toString());
    });

    p.stdout.on("error", (err) => {
        console.error("Error:", err.toString());
        publishLogs(`ERROR: ${err.toString()}`);
    });

    p.on("close", async () => {
        console.log(`Build Complete.`);
        publishLogs("Build Complete...");
        //read the dist floder after the build is complete
        // const distFolderPath = path.join(__dirname, "output", "dist");

        //possiblity for react and vite
        const possibleFolders = ["dist", "build"];
        let distFolderPath = null;

        for (const folder of possibleFolders) {
            const possibleFolderPath = path.join(__dirname, "output", folder);
            if (fs.existsSync(possibleFolderPath)) {
                distFolderPath = possibleFolderPath;
                break;
            }
        }

        if (!distFolderPath) {
            console.error("Neither 'dist' nor 'build' folder found!");
            publishLog("Neither 'dist' nor 'build' folder found!");
            process.exit(1);
        }

        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });

        publishLogs("Starting To Upload...");
        //upload each file in the dist folder to S3
        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                continue;
            }

            console.log("Uploading file: ", file);
            publishLogs(`Uploading file: ${file}`);

            const command = new PutObjectCommand({
                Bucket: 'vc-build-server',
                Key: `__output/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath),
            });
            try {
                await s3.send(command);
                console.log("uploaded file: ", file);
                publishLogs(`uploaded file: ${file}`);
            } catch (err) {
                console.error("Error uploading file:", err);
                publishLog(`Error uploading file: ${err}`);
                throw err;
            }
        }
        console.log("Done....");
        publishLogs("Done...");
        setTimeout(() => process.exit(0), 10000); //wait for 10 seconds
        // process.exit(0);
    });

}

init();