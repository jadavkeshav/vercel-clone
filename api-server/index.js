const express = require('express');
const { generateSlug } = require("random-word-slugs");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
require('dotenv').config();

const ecs = new ECSClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const config = {
    CLUSTER: '',
    TASK: ''
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
                subnets: [''],
                securityGroups: [''],
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: '',
                    environment: [
                        { name: 'GIT_REPOSITORY_URL', value: gitURL },
                        { name: 'PROJECT_ID', value: projectSlug }
                    ]
                }
            ]
        }
    });

    await ecs.send(command);
    return res.json({ status : 'queued', data : {projectSlug, url: `http://${projectSlug}.localhost:8000`} });
})

app.listen(PORT, () => console.log(`API SERVER Running On PORT : ${PORT}`));