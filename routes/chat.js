const express = require('express');
const router = express.Router();
const { Message, User } = require('../models');
const { Op, Sequelize } = require('sequelize');

// 📨 Inbox (last conversations)
// router.get('/inbox/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const inbox = await Message.findAll({
//       where: {
//         [Op.or]: [
//           { sender_id: userId },
//           { receiver_id: userId }
//         ]
//       },
//       include: [
//         { model: User, as: 'Sender', attributes: ['id', 'username'] },
//         { model: User, as: 'Receiver', attributes: ['id', 'username'] }
//       ],
//       order: [['created_at', 'DESC']]
//     });

//     res.json({ success: true, inbox });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//   }
// });

// // 📨 Full chat between two users
// router.get('/messages/:userId/:otherUserId', async (req, res) => {
//   try {
//     const { userId, otherUserId } = req.params;

//     const messages = await Message.findAll({
//       where: {
//         [Op.or]: [
//           { sender_id: userId, receiver_id: otherUserId },
//           { sender_id: otherUserId, receiver_id: userId }
//         ]
//       },
//       order: [['created_at', 'ASC']]
//     });

//     res.json({ success: true, messages });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//   }
// });

// // 📨 Send message
// router.post('/send', async (req, res) => {
//   try {
//     const { sender_id, receiver_id, content } = req.body;

//     if (!sender_id || !receiver_id || !content) {
//       return res.status(400).json({ success: false, message: 'All fields are required' });
//     }

//     const message = await Message.create({
//       sender_id,
//       receiver_id,
//       content
//     });

//     res.json({ success: true, message });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//   }
// });


// Send a new message (store in DB)
router.post('/send', async (req, res) => {
  try {
    const { sender_id, receiver_id, content } = req.body;

    if (!sender_id || !receiver_id || !content) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const newMessage = await Message.create({ sender_id, receiver_id, content });
    return res.json({ success: true, message: 'Message sent', data: newMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Get all messages between two users
router.get('/conversation/:user1_id/:user2_id', async (req, res) => {
  try {
    const { user1_id, user2_id } = req.params;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: user1_id, receiver_id: user2_id },
          { sender_id: user2_id, receiver_id: user1_id }
        ]
      },
      order: [['created_at', 'ASC']]
    });

    return res.json({ success: true, data: messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// List recent chats for a user
router.get('/list/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const latestMessages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: user_id },
          { receiver_id: user_id }
        ]
      },
      attributes: [
        'id',
        'sender_id',
        'receiver_id',
        'content',
        'created_at',
        [Sequelize.literal(`
          CASE 
            WHEN sender_id = ${user_id} THEN receiver_id
            ELSE sender_id
          END
        `), 'conversation_with']
      ],
      order: [['created_at', 'DESC']],
      raw: true
    });

    // Deduplicate by conversation_with
    const seen = new Set();
    const filtered = latestMessages.filter(msg => {
      const key = msg.conversation_with;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    res.status(200).json({
      success: true,
      data: filtered
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});
// router.get('/list/:user_id', async (req, res) => {
//   try {
//     const { user_id } = req.params;

//     const messages = await Message.findAll({
//       where: {
//         [Op.or]: [
//           { sender_id: user_id },
//           { receiver_id: user_id }
//         ]
//       },
//       order: [['created_at', 'DESC']],
//       limit: 20 // Latest 20 messages
//     });

//     return res.json({ success: true, data: messages });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//   }
// });

module.exports = router;


