const express = require('express');
const router = express.Router();
const { Notification } = require('../models'); 


router.get('/', async (req, res) => {
    const { userId } = req.query; // get user ID from query
  
    try {
      const notifications = await Notification.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']]
      });
  
      res.json({ success: true, data: notifications });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  

  router.put('/read-all', async (req, res) => {
    const { userId } = req.body;
  
    try {
      await Notification.update(
        { is_read: true },
        { where: { user_id: userId } }
      );
  
      res.json({ success: true, message: "All notifications marked as read" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  


  module.exports = router;
