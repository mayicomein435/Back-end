const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

// Create a new task
router.post('/', [auth, role(['admin'])], async (req, res) => {
    const { title, description, status, assignedTo, dueDate, category, project, technologies, attachments } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            status,
            assignedTo,
            dueDate,
            category,
            project,
            technologies,
            attachments,
        });

        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all tasks with filtering
router.get('/', auth, async (req, res) => {
    const { category, dueDate, description, project } = req.query;

    let query = {};

    if (category) query.category = category;
    if (dueDate) query.dueDate = { $lte: new Date(dueDate) };
    if (description) query.description = { $regex: description, $options: 'i' };
    if (project) query.project = project;

    try {
        const tasks = await Task.find(query).populate('assignedTo', 'name email').populate('project', 'title');
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
