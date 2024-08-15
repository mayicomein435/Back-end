const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
    },
    deadlines: {
        type: Date,
    },
    teamLeader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    budget: {
        type: Number,
    },
    resources: {
        type: Number,
    },
    risks: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Project', ProjectSchema);
