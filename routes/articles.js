// routes/articles.js
const express = require('express');
const router = express.Router();
const { Article } = require('../models'); // Import your Article model
const authenticateToken = require("../middleware/auth");

// Create a new article
// router.post('/create', async (req, res) => {
//   try {
//     const { title, excerpt, description, category, read_time, featured_image_url } = req.body;

//     // Create a new article record
//     const newArticle = await Article.create({
//       title,
//       excerpt,
//       description,
//       category,
//       read_time,
//       featured_image_url
//     });

//     // Return the created article as a JSON response
//     res.status(201).json({
//       success: true,
//       message: 'Article created successfully',
//       data: newArticle
//     }); 
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while creating the article',
//       error: error.message
//     });
//   }
// });


// // routes/articles.js
// router.get('/list', async (req, res) => {
//     try {
//       const articles = await Article.findAll(); // Fetch all articles
  
//       res.status(200).json({
//         success: true,
//         data: articles
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         success: false,
//         message: 'An error occurred while fetching the articles',
//         error: error.message
//       });
//     }
//   });
  

// 📝 Create a new article (Protected)
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { title, excerpt, description, category, read_time, featured_image_url } = req.body;
    const userId = req.user.user_id; // Authenticated user's ID

    const newArticle = await Article.create({
      title,
      excerpt,
      description,
      category,
      read_time,
      featured_image_url,
      user_id: userId
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: newArticle
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the article',
      error: error.message
    });
  }
});

// 📚 List all articles
router.get('/list', async (req, res) => {
  try {
    const articles = await Article.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the articles',
      error: error.message
    });
  }
});

module.exports = router;
