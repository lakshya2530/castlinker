const express = require('express');
const router = express.Router();
const { Event } = require('../models');  // Import the Event model

// Create Event
router.post('/create', async (req, res) => {
  try {
    const { title, description, date, time, location, event_type, featured_image_url } = req.body;

    // Create a new event
    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      location,
      event_type,
      featured_image_url
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the event',
      error: error.message
    });
  }
});

// List Events
router.get('/list', async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['date', 'ASC']] // Order by event date (ascending)
    });

    res.status(200).json({
      success: true,
      message: 'Events fetched successfully',
      data: events
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the events',
      error: error.message
    });
  }
});

module.exports = router;
