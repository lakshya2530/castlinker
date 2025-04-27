const express = require('express');
const router = express.Router();
const { Notification } = require('../models'); 
const authenticateToken = require("../middleware/auth");


router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.user_id; // Get user ID directly from the decoded token

    console.log("User ID from token:", userId); // Verify userId

    try {
        const notifications = await Notification.findAll({
            where: { user_id: userId }, // Correct query using user_id
            order: [['created_at', 'DESC']]
        });

        res.json({ success: true, data: notifications });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});



router.put('/read-all', authenticateToken, async (req, res) => {
    const userId = req.user.user_id; // Get user ID directly from the decoded token

    console.log("User ID:", userId); // For debugging purposes
  
    try {
        // Mark all notifications as read for the user
        const [updatedCount] = await Notification.update(
            { is_read: true }, // Set 'is_read' to true
            { where: { user_id: userId } } // Filter by the user_id
        );
      
        if (updatedCount === 0) {
            return res.status(404).json({ success: false, message: "No notifications found to mark as read." });
        }

        res.json({ success: true, message: `${updatedCount} notifications marked as read.` });
    } catch (err) {
        console.error("Error:", err); // Log any error for debugging
        res.status(500).json({ success: false, message: err.message });
    }
});

  


  module.exports = router;
