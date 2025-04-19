// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { Project } = require('../models');
const authenticateToken = require('../middleware/auth');

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name, description, location, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const newProject = await Project.create({
      name,
      description,
      location,
      status,
      user_id: req.user.user_id // assuming you fixed the JWT payload to include user_id
    });

    res.status(201).json({ project: newProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating project', error });
  }
});

module.exports = router;
