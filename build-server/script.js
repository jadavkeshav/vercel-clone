const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");

//create an S3 client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const PROJECT_ID = process.env.PROJECT_ID;

async function init() {
    console.log("Executing Script.js");

    const outDirPath = path.join(__dirname, "output");

    const p = exec(`cd ${outDirPath} && npm install  && npm run build`);

    //when the command is running we can see the output in the console
    p.stdout.on("data", (data) => {
        console.log(data.toString());
    });

    p.stdout.on("error", (err) => {
        console.error("Error:", err.toString());
    });

    p.on("close", () => {
        console.log(`Build Complete.`);

        //read the dist floder after the build is complete
        const distFolderPath = path.join(__dirname, "output", "dist");
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });

        //upload each file in the dist folder to S3
        for (const filePath of distFolderContents) {
            if (fs.lstatSync(filePath).isDirectory()) {
                continue;
            }

            console.log("Uploading file: ", filePath);

            const command = new PutObjectCommand({
                Bucket: '',
                Key: `__output/${PROJECT_ID}/${filePath}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath),
            });

            await s3.send(command);
            console.log("uploaded file: ", filePath);

        }
        console.log("Done....");
    });

}

init();