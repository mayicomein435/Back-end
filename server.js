const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const projectRoutes = require('./routes/project');
const { sendDeadlineAlerts } = require('./utils/notifications');
const { generateProjectReport } = require('./utils/reports');

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

app.get('/api/projects/:id/report', async (req, res) => {
    try {
        const reportPath = await generateProjectReport(req.params.id);
        res.download(reportPath);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

setInterval(sendDeadlineAlerts, 24 * 60 * 60 * 1000); // Send alerts daily

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
