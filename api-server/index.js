const express = require('express');
const { generateSlug } = require("random-word-slugs");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const Redis = require("ioredis");
const { Server } = require("socket.io");
const { default: axios } = require('axios');
const connectDB = require('./db/connectDB');
const authRoutes = require('./routes/auth.route');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { sendmail } = require('./utils/sendMail');
require('dotenv').config();

const subscriber = new Redis(process.env.REDIS_URL);

const io = new Server({ cors: '*' });

io.listen(9001, () => {
    console.log("Socket.IO Server Running On PORT : 9001");
});

io.on("connection", (socket) => {
    socket.on("subscribe", (channel) => {
        // console.log(`Client subscribed to channel: ${channel}`);
        socket.join(channel);
        socket.emit("message", `Subscribed to channel: ${channel}`);
    });
    
});

const ecs = new ECSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const config = {
    CLUSTER: process.env.AWS_ECS_CLUSTER,
    TASK: process.env.AWS_ECS_TASK_DEFINITION
}

const app = express();
const PORT = 9000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use("/api/auth", authRoutes)

// app.post("/projects", async (req, res) => {
//     const { gitURL } = req.body;
//     const projectSlug = generateSlug();

//     //Spin ECS Container
//     const command = new RunTaskCommand({
//         cluster: config.CLUSTER,
//         taskDefinition: config.TASK,
//         launchType: "FARGATE",
//         count: 1,
//         networkConfiguration: {
//             awsvpcConfiguration: {
//                 assignPublicIp: 'ENABLED',
//                 subnets: [process.env.AWS_ECS_CLUSTER_SUBNETS],
//                 securityGroups: [process.env.AWS_ECS_CLUSTER_SECURITY_GROUP],
//             }
//         },
//         overrides: {
//             containerOverrides: [
//                 {
//                     name: process.env.AWS_ECS_IMAGE_NAME,
//                     environment: [
//                         { name: 'GIT_REPOSITORY_URL', value: gitURL },
//                         { name: 'PROJECT_ID', value: projectSlug }
//                     ]
//                 }
//             ]
//         }
//     });

//     await ecs.send(command);
//     console.log("ECS Task Started for project:", projectSlug);  
//exit the task
//     process.exit(0);

//     return res.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000` } });
// })

app.post("/projects", async (req, res) => {
    try {
        const { gitURL } = req.body;
        const projectSlug = generateSlug();
        console.log("Received gitURL:", gitURL);
        const response = await axios.post(
            process.env.AWS_API_GATEWAY_URL,
            { gitURL, projectSlug }
        );
        console.log("hit the API", response.data);
        return res.json({
            status: 'queued',
            data: {
                projectSlug,
                url: `http://${projectSlug}.localhost:8000`,
            }
        });
    } catch (error) {
        console.error("Error in /projects endpoint:", error);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
    }
});

async function initRedisSubscribe() {
    console.log("Subscribed To Logs Channel");
    subscriber.psubscribe("logs:*");
    subscriber.on("pmessage", (pattern, channel, message) => {
        console.log("Redis Channel:", channel);
        io.to(channel).emit("message", message);
    });
}

initRedisSubscribe();

app.listen(PORT, () => {
    connectDB();
  
    console.log(`API SERVER Running On PORT : ${PORT}`);
});