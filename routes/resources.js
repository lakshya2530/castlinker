const express = require('express');
const router = express.Router();
const { Resource } = require('../models');

// POST: Create Resource
router.post('/create', async (req, res) => {
  try {
    const { title, description, type, file_url, featured_image_url } = req.body;

    const newResource = await Resource.create({
      title,
      description,
      type,
      file_url,
      featured_image_url
    });

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: newResource
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error creating resource',
      error: err.message
    });
  }
});

// GET: List Resources
router.get('/list', async (req, res) => {
  try {
    const resources = await Resource.findAll({ order: [['created_at', 'DESC']] });

    res.status(200).json({
      success: true,
      message: 'Resources fetched successfully',
      data: resources
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching resources',
      error: err.message
    });
  }
});

module.exports = router;
