const express = require('express');
const router = express.Router();
const { Post } = require('../models');
const upload = require('../middleware/upload'); // Multer setup
const { Op } = require('sequelize');

// ✅ Create Post
router.post('/', upload.single('media'), async (req, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      media: req.file ? req.file.filename : null,
      user_id: 1 // Hardcoded for now
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📝 Update Post
router.put('/:id', upload.single('media'), async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

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
router.get('/', async (req, res) => {
  const { title, category, tags, pincode, location } = req.query;
  const where = {};

  if (title) where.title = { [Op.iLike]: `%${title}%` };
  if (category) where.category = category;
  if (tags) where.tags = { [Op.iLike]: `%${tags}%` };
  if (pincode) where.pincode = pincode;
  if (location) where.location = { [Op.iLike]: `%${location}%` };

  try {
    const posts = await Post.findAll({ where });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👁️ View Single Post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete Post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
