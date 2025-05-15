const express = require('express');
const router = express.Router();
const { Event } = require('../models');  // Import the Event model
const authenticateToken = require('../middleware/auth'); // Adjust path as needed

// Create Event
// router.post('/create', async (req, res) => {
//   try {
//     const { title, description, date, time, location, event_type, featured_image_url } = req.body;

//     // Create a new event
//     const newEvent = await Event.create({
//       title,
//       description,
//       date,
//       time,
//       location,
//       event_type,
//       featured_image_url
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Event created successfully',
//       data: newEvent
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while creating the event',
//       error: error.message
//     });
//   }
// });

// // List Events
// router.get('/list', async (req, res) => {
//   try {
//     const events = await Event.findAll({
//       order: [['date', 'ASC']] // Order by event date (ascending)
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Events fetched successfully',
//       data: events
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching the events',
//       error: error.message
//     });
//   }
// });

// Create Event (Protected)
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { title, description, date, time, location, event_type, featured_image_url } = req.body;

    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      location,
      event_type,
      featured_image_url,
      user_id: req.user.id // Optional: attach user_id from token
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

// List Events (Protected)
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['date', 'ASC']]
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


router.get('/list/admin', async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['date', 'ASC']]
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

router.post('/create/admin', async (req, res) => {
  try {
    const { title, description, date, time, location, event_type, featured_image_url, event_status, expected_attribute } = req.body;

    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      location,
      event_type,
      featured_image_url,
      event_status,
      expected_attribute,
      user_id: 0 // Optional: attach user_id from token
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

router.get('/admin/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


router.put('/admin/:id', async (req, res) => {
  try {
    const { title, description, date, time, location, event_type, featured_image_url, event_status, expected_attribute } = req.body;

    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await event.update({
      title,
      description,
      date,
      time,
      location,
      event_type,
      featured_image_url,
      event_status,
      expected_attribute
    });

    res.json({ success: true, message: 'Event updated successfully', data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


router.delete('/admin/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await event.destroy();
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
