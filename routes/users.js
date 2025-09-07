const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models"); // ✅ Import db
const { User,UserLike,sequelize } = require('../models');
const authenticateToken = require('../middleware/auth'); // Adjust path as needed

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } }); // ✅ This line works now

    if (existingUser)
      return res.status(409).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashed });

    const token = jwt.sign({ id: newUser.id }, "your_secret_key", {
      expiresIn: "7d",
    });

    res
      .status(201)
      .json({ user: { id: newUser.id, email: newUser.email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const currentUserId = req.query.liker_id || null; // The logged-in user ID, used for is_like & is_connected

    const users = await User.findAll({
      attributes: {
        include: [
          // Total likes each user has
          [
            sequelize.literal(`(
              SELECT COUNT(*) 
              FROM user_likes ul
              WHERE ul.liked_id = "User".id
            )`),
            'total_likes'
          ],
          // is_like: only if currentUserId provided
          ...(currentUserId ? [
            [
              sequelize.literal(`(
                SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END
                FROM user_likes ul
                WHERE ul.liker_id = ${currentUserId} 
                  AND ul.liked_id = "User".id
              )`),
              'is_like'
            ],
            // is_connected: check connection
            [
              sequelize.literal(`(
                SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END
                FROM user_connections uc
                WHERE (uc.user_id = ${currentUserId} AND uc.connected_user_id = "User".id)
                   OR (uc.connected_user_id = ${currentUserId} AND uc.user_id = "User".id)
              )`),
              'is_connected'
            ]
          ] : [])
        ]
      }
    });

    res.json({ success: true, data: users });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// router.get('/', async (req, res) => {
//   try {
//     const likerId = req.query.liker_id || null; // Optional for is_like

//     const users = await User.findAll({
//       attributes: {
//         include: [
//           // Total likes each user has
//           [
//             sequelize.literal(`(
//               SELECT COUNT(*) 
//               FROM user_likes ul
//               WHERE ul.liked_id = "User".id
//             )`),
//             'total_likes'
//           ],
//           // Only calculate is_like if liker_id is provided
//           ...(likerId ? [
//             [
//               sequelize.literal(`(
//                 SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END
//                 FROM user_likes ul
//                 WHERE ul.liker_id = ${likerId} 
//                 AND ul.liked_id = "User".id
//               )`),
//               'is_like'
//             ]
//           ] : [])
//         ]
//       }
//     });

//     res.json({ success: true, data: users });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// router.get('/', async (req, res) => {
  
//   try {
//     const users = await User.findAll();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send(`Database connected successfully at ${result.rows[0].now}`);
    } catch (err) {
        console.error('DB Connection Error:', err);
        res.status(500).send('Database connection failed: ' + err.message);
    }
});

router.post('/like', authenticateToken, async (req, res) => {
  try {
    const likerId = req.user.user_id;
    const { liked_id } = req.body;

    if (likerId === liked_id) {
      return res.status(400).json({ error: "You cannot like yourself" });
    }

    const existingLike = await UserLike.findOne({ where: { liker_id: likerId, liked_id } });

    if (existingLike) {
      // Unlike
      await existingLike.destroy();
      return res.json({ success: true, message: "Unliked successfully", is_like: false });
    } else {
      // Like
      await UserLike.create({ liker_id: likerId, liked_id });
      return res.json({ success: true, message: "Liked successfully", is_like: true });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
