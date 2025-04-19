// const express = require('express');
// const router = express.Router();
// const db = require('../models');
// const Job  = db.job;

// const { Op } = require('sequelize');

// // 🔸 CREATE
// router.post('/create-job', async (req, res) => {
//   try {
//     const job = await Job.create(req.body);
//     res.json(job);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 🔸 READ (All with optional filters)
// router.get('/', async (req, res) => {
//   const { title, location, type, tags } = req.query;
//   const where = {};

//   if (title) where.job_title = { [Op.iLike]: `%${title}%` };
//   if (location) where.location = { [Op.iLike]: `%${location}%` };
//   if (type) where.job_type = type;
//   if (tags) {
//     const tagsArray = Array.isArray(tags) ? tags : [tags];
//     where.tags = { [Op.contains]: tagsArray };
//   }

//   try {
//     const jobs = await Job.findAll({ where });
//     res.json(jobs);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // 🔸 READ Single
// router.get('/get-data/:id', async (req, res) => {
//   try {
//     const job = await Job.findByPk(req.params.id);
//     if (!job) return res.status(404).json({ error: 'Job not found' });
//     res.json(job);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 🔸 UPDATE
// router.put('/update-job/:id', async (req, res) => {
//   try {
//     const job = await Job.findByPk(req.params.id);
//     if (!job) return res.status(404).json({ error: 'Job not found' });

//     await job.update(req.body);
//     res.json(job);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 🔸 DELETE
// router.delete('/delete-jobs/:id', async (req, res) => {
//   try {
//     const job = await Job.findByPk(req.params.id);
//     if (!job) return res.status(404).json({ error: 'Job not found' });

//     await job.destroy();
//     res.json({ message: 'Job deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { Job } = require('../models');
// const { Op } = require('sequelize');

// // 🔹 Get all jobs (with optional filters)
// router.get('/', async (req, res) => {
//   const { title, location, type, tags } = req.query;
//   const where = {};

//   if (title) where.job_title = { [Op.iLike]: `%${title}%` };
//   if (location) where.location = { [Op.iLike]: `%${location}%` };
//   if (type) where.job_type = type;
//   if (tags) where.tags = { [Op.contains]: [tags] };

//   try {
//     const jobs = await Job.findAll({ where });
//     res.json(jobs);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const { Job } = require('../models');
const { Op } = require('sequelize');

// 🔍 GET: List + Filters
router.get('/', async (req, res) => {
  const { title, location, type, tags } = req.query;
  const where = {};

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

// 🆕 POST: Create a new job
router.post('/', async (req, res) => {
  try {
    const newJob = await Job.create(req.body);
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✏️ PUT: Update a job by ID
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    await job.update(req.body);
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ DELETE: Delete job by ID
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    await job.destroy();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;





