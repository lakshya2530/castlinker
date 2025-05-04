const express = require('express');
const router = express.Router();
const { Experience } = require('../models'); // assuming model is named Experience
const authenticateToken = require('../middleware/auth');

// CREATE Experience (authenticated users only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      type,
      project_title,
      role,
      director,
      production_company,
      year,
      description,
      files
    } = req.body;

    // Assuming user_id is fetched from the token
    const user_id = req.user.user_id;

    const experience = await Experience.create({
      user_id,
      type,
      project_title,
      role,
      director,
      production_company,
      year,
      description,
      files
    });

    res.status(201).json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE Experience (authenticated users only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    // Check if the user is the owner of this experience
    if (experience.user_id !== req.user.user_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this experience' });
    }

    const updated = await experience.update(req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// LIST Experiences (authenticated users only, optionally by user or type)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type } = req.query;

    const where = {
      user_id: req.user.user_id // Only fetch experiences belonging to the authenticated user
    };

    if (type) where.type = type;

    const experiences = await Experience.findAll({ where });
    res.json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
