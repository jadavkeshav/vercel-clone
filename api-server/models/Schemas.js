const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },  // store hashed password
}, { timestamps: true });

const domainSchema = new Schema({
  domainName: { type: String, required: true, unique: true, trim: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  isCustom: { type: Boolean, default: false },
}, { timestamps: true });

const projectSchema = new Schema({
  name: { type: String, required: true, trim: true },
  gitRepoUrl: { type: String, required: true, trim: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  domain: { type: Schema.Types.ObjectId, ref: 'Domain' }, // one domain per project
  buildLogs: { type: [String], default: [] },
  status: {
    type: String,
    enum: ['queued', 'building', 'deployed', 'failed'],
    default: 'queued',
  },
  deploymentUrl: { type: String, trim: true },
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', userSchema),
  Domain: mongoose.model('Domain', domainSchema),
  Project: mongoose.model('Project', projectSchema),
};
