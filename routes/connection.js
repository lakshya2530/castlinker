const { Connection } = require('../models');
const express = require('express');
const router = express.Router();

router.post('/connect', authenticateToken, async (req, res) => {
  const userId = req.user.user_id;
  const { target_user_id } = req.body;

  if (userId === parseInt(target_user_id)) {
    return res.status(400).json({ success: false, message: "You can't connect with yourself" });
  }

  try {
    const existing = await Connection.findOne({
      where: { user_id: userId, connected_user_id: target_user_id }
    });

    if (existing) {
      // Unconnect
      await existing.destroy();
      return res.json({ success: true, message: "User disconnected" });
    } else {
      // Connect
      await Connection.create({
        user_id: userId,
        connected_user_id: target_user_id
      });
      return res.json({ success: true, message: "User connected" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.user_id;
  
    try {
      const connections = await Connection.findAll({
        where: { user_id: userId },
        include: [{ model: User, as: 'connectedUser', attributes: ['id', 'name', 'profile_pic_url'] }]
      });
  
      res.json({ success: true, data: connections });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching connections', error: err.message });
    }
  });
  
  module.exports = router;
