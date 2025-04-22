const express = require('express');
const router = express.Router();
const { Course } = require('../models'); // Import the Course model

// Create Course API
router.post('/create', async (req, res) => {
  try {
    const { title, instructor, description, no_of_lessons, duration, level, featured_image_url } = req.body;

    // Create a new course
    const newCourse = await Course.create({
      title,
      instructor,
      description,
      no_of_lessons,
      duration,
      level,
      featured_image_url
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: newCourse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the course',
      error: error.message
    });
  }
});

// List Courses API
router.get('/list', async (req, res) => {
  try {
    const courses = await Course.findAll({
      order: [['created_at', 'DESC']] // Order by creation date, newest first
    });

    res.status(200).json({
      success: true,
      message: 'Courses fetched successfully',
      data: courses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the courses',
      error: error.message
    });
  }
});

module.exports = router;
