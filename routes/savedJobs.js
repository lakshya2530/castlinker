const express = require('express');
const router = express.Router();
const { SavedJob } = require('../models');

// Save a job
router.post('/save', async (req, res) => {
  try {
    const { job_id, user_id } = req.body;

    if (!job_id || !user_id) {
      return res.status(400).json({ success: false, message: 'job_id and user_id are required' });
    }

    const [saved, created] = await SavedJob.findOrCreate({
      where: { job_id, user_id }
    });

    if (!created) {
      return res.status(200).json({ success: true, message: 'Job already saved' });
    }

    res.status(201).json({ success: true, message: 'Job saved successfully', data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error saving job', error: err.message });
  }
});

// Unsave a job
router.post('/unsave', async (req, res) => {
  try {
    const { job_id, user_id } = req.body;

    if (!job_id || !user_id) {
      return res.status(400).json({ success: false, message: 'job_id and user_id are required' });
    }

    const deleted = await SavedJob.destroy({ where: { job_id, user_id } });

    if (deleted) {
      res.status(200).json({ success: true, message: 'Job unsaved successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Job not found in saved list' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error unsaving job', error: err.message });
  }
});

// List all saved jobs for a user
router.get('/list/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const savedJobs = await SavedJob.findAll({ where: { user_id } });

    res.status(200).json({ success: true, data: savedJobs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching saved jobs', error: err.message });
  }
});

module.exports = router;
