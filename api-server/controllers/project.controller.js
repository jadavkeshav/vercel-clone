const Project = require('../models/project.model');
const Domain = require('../models/domain.model');
const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const { generateSlug } = require('random-word-slugs');
const { default: axios } = require('axios');


const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

exports.createProject = async (req, res) => {
    try {
        const { name, gitRepoUrl } = req.body;
        const owner = req.userId;

        if (!name || !gitRepoUrl) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const projectSlug = generateSlug();
        console.log("projectSlug", projectSlug);
        const project = await Project.create({ name, gitRepoUrl, owner });

        const subdomain = projectSlug;
        const domain = await Domain.create({
            subdomain,
            project: project._id,
            isCustom: false
        });

        project.domain = domain._id;
        await project.save();

        await axios.post(process.env.AWS_API_GATEWAY_URL, {
            gitURL: gitRepoUrl,
            projectSlug
        });

        return res.status(201).json({
            success: true,
            message: "Project created and deployment initiated.",
            project: {
                id: project._id,
                name: project.name,
                slug: projectSlug,
                deploymentUrl: `http://${subdomain}.localhost:8000`
            }
        });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getUserProjects = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.userId }).populate('domain');
        res.status(200).json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching projects" });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.userId }).populate('domain');
        if (!project) return res.status(404).json({ success: false, message: "Project not found" });
        res.status(200).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching project" });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.userId;

        const project = await Project.findOne({ _id: projectId, owner: userId }).populate('domain');
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found or unauthorized" });
        }

        const projectSlug = project.domain.subdomain;
        const prefix = `__output/${projectSlug}`;

        await Domain.deleteOne({ project: project._id });

        const listCommand = new ListObjectsV2Command({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Prefix: prefix,
        });

        const listedObjects = await s3.send(listCommand);

        if (listedObjects.Contents && listedObjects.Contents.length > 0) {
            const deleteParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Delete: {
                    Objects: listedObjects.Contents.map((obj) => ({ Key: obj.Key })),
                },
            };

            const deleteCommand = new DeleteObjectsCommand(deleteParams);
            await s3.send(deleteCommand);
        }

        await Project.deleteOne({ _id: project._id });

        return res.status(200).json({ success: true, message: "Project and associated files deleted" });
    } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateProjectStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, owner: req.userId },
            { status, updatedAt: Date.now() },
            { new: true }
        );
        if (!project) return res.status(404).json({ success: false, message: "Project not found" });
        res.status(200).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating status" });
    }
};
