// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

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

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

module.exports = router;
