const nodemailer = require('nodemailer');
const Task = require('../models/Task');

const sendDeadlineAlerts = async () => {
    const tasks = await Task.find({ dueDate: { $lte: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) }, status: 'pending' }).populate('assignedTo', 'email name');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    tasks.forEach(task => {
        const mailOptions = {
            from: process.env.EMAIL,
            to: task.assignedTo.email,
            subject: 'Task Deadline Approaching',
            text: `Dear ${task.assignedTo.name}, the deadline for your task "${task.title}" is approaching. Please complete it on time.`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) console.error(err);
            else console.log(`Email sent: ${info.response}`);
        });
    });
};

module.exports = {
    sendDeadlineAlerts,
};
