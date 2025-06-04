const express = require('express');
const { generateSlug } = require("random-word-slugs");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const Redis = require("ioredis");
const { Server } = require("socket.io")
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

app.post("/projects", async (req, res) => {
    const { gitURL } = req.body;
    const projectSlug = generateSlug();

    //Spin ECS Container
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: "FARGATE",
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: [process.env.AWS_ECS_CLUSTER_SUBNETS],
                securityGroups: [process.env.AWS_ECS_CLUSTER_SECURITY_GROUP],
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: process.env.AWS_ECS_IMAGE_NAME,
                    environment: [
                        { name: 'GIT_REPOSITORY_URL', value: gitURL },
                        { name: 'PROJECT_ID', value: projectSlug }
                    ]
                }
            ]
        }
    });

    await ecs.send(command);
    return res.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000` } });
})

async function initRedisSubscribe(){
    console.log("Subscribed To Logs Channel");
    subscriber.psubscribe("logs:*");
    subscriber.on("pmessage", (pattern, channel, message) => {
        console.log("Redis Channel:", channel);
        io.to(channel).emit("message", message);
    });
}

initRedisSubscribe();

app.listen(PORT, () => console.log(`API SERVER Running On PORT : ${PORT}`));