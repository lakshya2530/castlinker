const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { PortfolioItem } = require('../models'); // Sequelize model or use raw query
const authenticateToken = require('../middleware/auth'); // your auth middleware

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/portfolio/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Add portfolio item
router.post('/add', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { type } = req.body;
    const filePath = `uploads/portfolio/${req.file.filename}`;

    const newItem = await PortfolioItem.create({
      user_id: userId,
      type,
      file_path: filePath,
    });

    res.json({ success: true, message: 'Portfolio item added', data: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Update portfolio item
router.put('/update/:id', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const { type } = req.body;

    const item = await PortfolioItem.findOne({ where: { id, user_id: userId } });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const filePath = req.file ? `uploads/portfolio/${req.file.filename}` : item.file_path;

    item.type = type || item.type;
    item.file_path = filePath;

    await item.save();

    res.json({ success: true, message: 'Portfolio item updated', data: item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Delete portfolio item
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const deleted = await PortfolioItem.destroy({ where: { id, user_id: userId } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Item not found' });

    res.json({ success: true, message: 'Portfolio item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Get portfolio list
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { type } = req.query;

    const where = { user_id: userId };
    if (type && type !== 'all') where.type = type;

    const items = await PortfolioItem.findAll({ where, order: [['created_at', 'DESC']] });

    res.json({ success: true, data: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
