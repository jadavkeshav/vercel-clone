const mongoose = require('mongoose');

const { Schema } = mongoose;

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    gitRepoUrl: {
        type: String,
        required: true,
        trim: true
    },
    owner: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    domain: { 
        type: Schema.Types.ObjectId, 
        ref: 'Domain' 
    },
    buildLogs: { 
        type: [String], 
        default: [] 
    },
    status: {
        type: String,
        enum: ['queued', 'building', 'deployed', 'failed'],
        default: 'queued',
    },
    deploymentUrl: { 
        type: String, 
        trim: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;