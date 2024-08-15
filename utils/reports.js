const fs = require('fs');
const path = require('path');
const Project = require('../models/Project');

const generateProjectReport = async (projectId) => {
    const project = await Project.findById(projectId).populate('teamLeader', 'name email');

    const reportContent = `
        Project Title: ${project.title}
        Description: ${project.description}
        Category: ${project.category}
        Deadlines: ${project.deadlines}
        Team Leader: ${project.teamLeader.name} (${project.teamLeader.email})
        Budget: ${project.budget}
        Resources: ${project.resources}
        Risks: ${project.risks}
        Created At: ${project.createdAt}
    `;

    const reportPath = path.join(__dirname, `../reports/${project.title}-report.txt`);

    fs.writeFileSync(reportPath, reportContent);

    return reportPath;
};

module.exports = {
    generateProjectReport,
};
