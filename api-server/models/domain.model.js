const mongoose = require('mongoose');

const { Schema } = mongoose;

const domainSchema = new mongoose.Schema({
    subdomain: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    isCustom: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Domain = mongoose.model('Domain', domainSchema);

module.exports = Domain;
