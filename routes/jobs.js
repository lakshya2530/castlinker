// routes/jobs.js
const express = require('express');
const { Job } = require('../models');
const { Op } = require('sequelize');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// 🔍 GET jobs for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  const { title, location, type, tags } = req.query;
  const where = { user_id: req.user.user_id }; // Only fetch jobs for the logged-in user

  if (title) where.job_title = { [Op.iLike]: `%${title}%` };
  if (location) where.location = { [Op.iLike]: `%${location}%` };
  if (type) where.job_type = type;
  if (tags) where.tags = { [Op.contains]: [tags] };

  try {
    const jobs = await Job.findAll({ where });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🆕 Create a new job
router.post('/', authenticateToken, async (req, res) => {
  console.log(req,'ss');
  try {
    const newJob = await Job.create({
      ...req.body,
      user_id: req.user.user_id,  // Associating the job with the logged-in user
    });
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✏️ Update a job (only if it belongs to the user)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const job = await Job.findOne({ where: { id: req.params.id, user_id: req.user.user_id } });
    if (!job) return res.status(404).json({ error: 'Job not found or unauthorized' });

    await job.update(req.body);
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ Delete a job (only if it belongs to the user)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const job = await Job.findOne({ where: { id: req.params.id, user_id: req.user.user_id } });
    if (!job) return res.status(404).json({ error: 'Job not found or unauthorized' });

    await job.destroy();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
