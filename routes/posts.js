const express = require('express');
const router = express.Router();
const { Post ,Application, Like,PostApplication} = require('../models');
const upload = require('../middleware/upload'); // Multer setup
const { Op, Sequelize } = require('sequelize');
const authenticateToken = require("../middleware/auth");

// ✅ Create Post
// router.post('/', upload.single('media'), async (req, res) => {
//   try {
//     const post = await Post.create({
//       ...req.body,
//       media: req.file ? req.file.filename : null,
//       user_id: 1 // Hardcoded for now
//     });
//     res.status(201).json(post);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // 📝 Update Post
// router.put('/:id', upload.single('media'), async (req, res) => {
//   try {
//     const post = await Post.findByPk(req.params.id);
//     if (!post) return res.status(404).json({ error: 'Post not found' });

//     await post.update({
//       ...req.body,
//       media: req.file ? req.file.filename : post.media
//     });

//     res.json(post);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // 🔍 List/Search Posts
// router.get('/', async (req, res) => {
//   const { title, category, tags, pincode, location } = req.query;
//   const where = {};

//   if (title) where.title = { [Op.iLike]: `%${title}%` };
//   if (category) where.category = category;
//   if (tags) where.tags = { [Op.iLike]: `%${tags}%` };
//   if (pincode) where.pincode = pincode;
//   if (location) where.location = { [Op.iLike]: `%${location}%` };

//   try {
//     const posts = await Post.findAll({ where });
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 👁️ View Single Post
// router.get('/:id', async (req, res) => {
//   try {
//     const post = await Post.findByPk(req.params.id);
//     if (!post) return res.status(404).json({ error: 'Post not found' });
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ❌ Delete Post
// router.delete('/:id', async (req, res) => {
//   try {
//     const post = await Post.findByPk(req.params.id);
//     if (!post) return res.status(404).json({ error: 'Post not found' });

//     await post.destroy();
//     res.json({ message: 'Post deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post('/', authenticateToken, upload.single('media'), async (req, res) => {
//   try {
//     const userId = req.user.user_id;

//     const post = await Post.create({
//       ...req.body,
//       media: req.file ? req.file.filename : null,
//       user_id: userId
//     });

//     res.status(201).json(post);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // ✏️ Update Post
// router.put('/:id', authenticateToken, upload.single('media'), async (req, res) => {
//   try {
//     const userId = req.user.user_id;

//     const post = await Post.findOne({ where: { id: req.params.id, user_id: userId } });
//     if (!post) return res.status(404).json({ error: 'Post not found or unauthorized' });

//     await post.update({
//       ...req.body,
//       media: req.file ? req.file.filename : post.media
//     });

//     res.json(post);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

router.post('/', authenticateToken, upload.single('media'), async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { title } = req.body;

    // Check for duplicate title for the same user
    const existingPost = await Post.findOne({ where: { title, user_id: userId } });
    if (existingPost) {
      return res.status(400).json({ error: 'Post with this title already exists' });
    }

    const post = await Post.create({
      ...req.body,
      media: req.file ? req.file.filename : null,
      user_id: userId
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/apply/:postId', authenticateToken, async (req, res) => {
  const userId = req.user.user_id;
  const { postId } = req.params;

  try {
    // Check if already applied
    const existing = await PostApplication.findOne({
      where: { post_id: postId, user_id: userId }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already applied to this post' });
    }

    const application = await PostApplication.create({
      post_id: postId,
      user_id: userId
    });

    res.status(201).json({ message: 'Successfully applied', application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', authenticateToken, upload.single('media'), async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { title } = req.body;

    const post = await Post.findOne({ where: { id: req.params.id, user_id: userId } });
    if (!post) return res.status(404).json({ error: 'Post not found or unauthorized' });

    // Check if the new title already exists on another post by the same user
    const duplicate = await Post.findOne({
      where: {
        title,
        user_id: userId,
        id: { [Op.ne]: req.params.id } // exclude current post
      }
    });
    if (duplicate) {
      return res.status(400).json({ error: 'Another post with this title already exists' });
    }

    await post.update({
      ...req.body,
      media: req.file ? req.file.filename : post.media
    });

    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// 🔍 List/Search Posts
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.user_id;
  const { title, category, tags, pincode, location } = req.query;

  const where = { user_id: userId };

  if (title) where.title = { [Op.iLike]: `%${title}%` };
  if (category) where.category = category;
  if (tags) where.tags = { [Op.iLike]: `%${tags}%` };
  if (pincode) where.pincode = pincode;
  if (location) where.location = { [Op.iLike]: `%${location}%` };

  try {
    const posts = await Post.findAll({
      where,
      attributes: {
        include: [
          [
            // Total applications for this post
            Sequelize.literal(`(
              SELECT COUNT(*) FROM applications AS a
              WHERE a.job_id = "Post"."id"
            )`),
            'total_applications'
          ],
          [
            // Total likes for this post
            Sequelize.literal(`(
              SELECT COUNT(*) FROM likes AS l
              WHERE l.post_id = "Post"."id"
            )`),
            'total_likes'
          ],
        [
            Sequelize.literal(`(
            SELECT COUNT(*)
            FROM post_applications AS pa
            WHERE pa.post_id = "Posts".id
            )`), 'application_count'
        ],
          [
            Sequelize.literal(`EXISTS (
              SELECT 1 FROM likes AS l
              WHERE l.post_id = "Post"."id"
              AND l.user_id = ${userId}
            )`),
            "is_liked",
          ],
        ]
      }
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/admin', async (req, res) => {
  const { title, category, tags, pincode, location } = req.query;
  const where = {};

  if (title) where.title = { [Op.iLike]: `%${title}%` };
  if (category) where.category = category;
  if (tags) where.tags = { [Op.iLike]: `%${tags}%` };
  if (pincode) where.pincode = pincode;
  if (location) where.location = { [Op.iLike]: `%${location}%` };

  try {
    const posts = await Post.findAll({
      where,
      attributes: {
        include: [
          [
            // Subquery for total applications
            Sequelize.literal(`(
              SELECT COUNT(*) FROM applications AS a
              WHERE a.job_id = "Post"."id"
            )`),
            'total_applications'
          ],
          [
            Sequelize.literal(`(
            SELECT COUNT(*)
            FROM post_applications AS pa
            WHERE pa.post_id = Post.id
          )`), 'application_count'
        ],
          [
            // Subquery for total likes
            Sequelize.literal(`(
              SELECT COUNT(*) FROM likes AS l
              WHERE l.post_id = "Post"."id"
            )`),
            'total_likes'
          ]
        ]
      }
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.get('/admin', async (req, res) => {
//  // const userId = req.user.user_id;
//   const { title, category, tags, pincode, location } = req.query;
//   const where = {  }; // ✅ Only fetch current user's posts

//   if (title) where.title = { [Op.iLike]: `%${title}%` };
//   if (category) where.category = category;
//   if (tags) where.tags = { [Op.iLike]: `%${tags}%` };
//   if (pincode) where.pincode = pincode;
//   if (location) where.location = { [Op.iLike]: `%${location}%` };
//   try {
//     const posts = await Post.findAll({ where });
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// 👁️ View Single Post
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id, user_id: req.user.user_id } });
    if (!post) return res.status(404).json({ error: 'Post not found or unauthorized' });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete Post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id, user_id: req.user.user_id } });
    if (!post) return res.status(404).json({ error: 'Post not found or unauthorized' });

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
