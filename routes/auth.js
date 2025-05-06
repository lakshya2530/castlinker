// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const multer = require('multer');


// Configure multer storage for profile image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile_pics/');  // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Use timestamp for unique filenames
  }
});

const upload = multer({ storage: storage });
// // Register a new user
// router.post("/register", async (req, res) => {
//     const { username, email, password, user_role, user_type } = req.body;
//     console.log(username, email, password);
//   console.log("console 1");

//   try {
//     const existingUser = await User.findOne({ where: { email } });
//     console.log("console 2");
//     if (existingUser)
//       return res.status(400).json({ message: "Email already in use" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//       user_role,  // admin or user
//       user_type   // producer, actor, etc.
//     });
//     console.log("console 3");

//     const token = jwt.sign(
//       { user_id: user.user_id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(201).json({ token });
//     console.log("console 4");
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//     console.log("console 0");
//   }
// });

// // Login user
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
// console.log("login 1")
//   // Find the user by email
//   const user = await User.findOne({ where: { email } });
// console.log("login 2");


//   if (!user) return res.status(400).json({ error: "User not found" });

//   // Assuming you're using bcrypt to compare the password (adjust logic accordingly)
//   const passwordMatch = true; // This should be bcrypt.compare logic

//   if (!passwordMatch)
//     return res.status(400).json({ error: "Incorrect password" });

//   // Create JWT token with user_id in the payload
//   const token = jwt.sign(
//     { user_id: user.id, email: user.email }, // Include user_id here
//     process.env.JWT_SECRET, // Secret key for encoding
//     { expiresIn: "1h" } // Set expiration time
//   );

//   res.json({ token });
// });

router.post("/register", async (req, res) => {
  const { username, email, password, user_role, user_type } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      user_role,
      user_type
    });

    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Exclude password from response
    const userData = { ...user.toJSON() };
    delete userData.password;

    res.status(201).json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Exclude password from response
    const userData = { ...user.toJSON() };

    delete userData.password;

    res.json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findByPk(req.query.user_id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

router.put('/update-profile', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      bio, age_range, weight, height,
      eye_color, hair_color, union_status,
      languages, representation, special_skills,acting_skills,
      technical_skills,
      physical_attributes 
    } = req.body;

    // Default to null for profile image
    let profileImageUrl = null;

    // If a file is uploaded, store the file path
    if (req.file) {
      profileImageUrl = `uploads/profile_pics/${req.file.filename}`;  // Path to the uploaded image
    }

    // Find the user by user_id
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update the user profile data
    user.bio = bio ?? user.bio;
    user.age_range = age_range ?? user.age_range;
    user.weight = weight ?? user.weight;
    user.height = height ?? user.height;
    user.eye_color = eye_color ?? user.eye_color;
    user.hair_color = hair_color ?? user.hair_color;
    user.union_status = union_status ?? user.union_status;
    user.languages = languages ?? user.languages;
    user.representation = representation ?? user.representation;
    user.acting_skills = acting_skills ? JSON.stringify(acting_skills) : user.acting_skills;
    user.technical_skills = technical_skills ? JSON.stringify(technical_skills) : user.technical_skills;
    user.special_skills = special_skills ? JSON.stringify(special_skills) : user.special_skills;
    user.physical_attributes = physical_attributes ? JSON.stringify(physical_attributes) : user.physical_attributes;

 //   user.special_skills = special_skills ?? user.special_skills;

    // If a profile image was uploaded, update the user's profile image URL
    if (profileImageUrl) {
      user.profile_image = profileImageUrl;
    }

    // Save the updated user information to the database
    await user.save();

    // Return success response with updated user data
    res.json({ success: true, message: 'Profile updated successfully', data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});



module.exports = router;
