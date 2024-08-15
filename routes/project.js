const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

// Create a new project
router.post('/', [auth, role(['admin'])], async (req, res) => {
    const { title, description, category, deadlines, teamLeader, budget, resources, risks } = req.body;

    try {
        const newProject = new Project({
            title,
            description,
            category,
            deadlines,
            teamLeader,
            budget,
            resources,
            risks,
        });

        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all projects
router.get('/', auth, async (req, res) => {
    try {
        const projects = await Project.find().populate('teamLeader', 'name email');
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a single project
router.get('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('teamLeader', 'name email');
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a project
router.put('/:id', [auth, role(['admin'])], async (req, res) => {
    const { title, description, category, deadlines, teamLeader, budget, resources, risks } = req.body;

    const projectFields = { title, description, category, deadlines, teamLeader, budget, resources, risks };

    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: projectFields },
            { new: true }
        );

        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a project
router.delete('/:id', [auth, role(['admin'])], async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        await project.remove();
        res.json({ msg: 'Project removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
