// routes/projectRoutes.js
const express = require("express");
const router = express.Router();
const { Project } = require("../models");
const authenticateToken = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const userId = 3;

    const projects = await Project.findAll({
      where: { user_id: userId }, // Fetch only the projects for the logged-in user
    });

    res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projects", error });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { name, description, location, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const newProject = await Project.create({
      name,
      description,
      location,
      status,
      user_id: 3,
    });

    res.status(201).json({ project: newProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating project", error });
  }
});

// routes/projectRoutes.js

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, status } = req.body;
    const userId = req.user.user_id;

    // Find the project by ID and user_id
    const project = await Project.findOne({ where: { id, user_id: userId } });

    if (!project) {
      return res.status(404).json({
        message:
          "Project not found or you do not have permission to edit this project",
      });
    }

    // Update project details
    project.name = name || project.name;
    project.description = description || project.description;
    project.location = location || project.location;
    project.status = status || project.status;

    await project.save(); // Save the updated project

    res.status(200).json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating project", error });
  }
});

// routes/projectRoutes.js

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    // Find the project by ID and user_id
    const project = await Project.findOne({ where: { id, user_id: userId } });

    if (!project) {
      return res.status(404).json({
        message:
          "Project not found or you do not have permission to delete this project",
      });
    }

    // Delete the project
    await project.destroy();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting project", error });
  }
});

module.exports = router;
