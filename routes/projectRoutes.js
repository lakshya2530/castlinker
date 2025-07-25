// routes/projectRoutes.js
const express = require("express");
const router = express.Router();
const { Project } = require("../models");
const authenticateToken = require("../middleware/auth");
const { ProjectTeam, Milestone,User,ProjectTeamChat, sequelize } = require('../models');

// router.get("/", async (req, res) => {
//   try {
//     const userId = 3;

//     const projects = await Project.findAll({
//       where: { user_id: userId }, // Fetch only the projects for the logged-in user
//     });

//     res.status(200).json({ projects });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching projects", error });
//   }
// });

// router.post("/create", async (req, res) => {
//   try {
//     const { name, description, location, status } = req.body;

//     if (!name) {
//       return res.status(400).json({ message: "Project name is required" });
//     }

//     const newProject = await Project.create({
//       name,
//       description,
//       location,
//       status,
//       user_id: 3,
//     });

//     res.status(201).json({ project: newProject });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error creating project", error });
//   }
// });

// // routes/projectRoutes.js

// router.put("/:id", authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description, location, status } = req.body;
//     const userId = req.user.user_id;

//     // Find the project by ID and user_id
//     const project = await Project.findOne({ where: { id, user_id: userId } });

//     if (!project) {
//       return res.status(404).json({
//         message:
//           "Project not found or you do not have permission to edit this project",
//       });
//     }

//     // Update project details
//     project.name = name || project.name;
//     project.description = description || project.description;
//     project.location = location || project.location;
//     project.status = status || project.status;

//     await project.save(); // Save the updated project

//     res.status(200).json({ project });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error updating project", error });
//   }
// });

// // routes/projectRoutes.js

// router.delete("/:id", authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.user_id;

//     // Find the project by ID and user_id
//     const project = await Project.findOne({ where: { id, user_id: userId } });

//     if (!project) {
//       return res.status(404).json({
//         message:
//           "Project not found or you do not have permission to delete this project",
//       });
//     }

//     // Delete the project
//     await project.destroy();

//     res.status(200).json({ message: "Project deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error deleting project", error });
//   }
// });


router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id; // ✅ from token

    const projects = await Project.findAll({
      where: { user_id: userId },
    });

    res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projects", error });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id; // ✅ from token

    const projects = await Project.findAll({
      where: { user_id: userId },
    });

    res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projects", error });
  }
});
router.get('/milestones/:project_id', async (req, res) => {
  const { project_id } = req.params;

  try {
    const milestones = await Milestone.findAll({
      where: { project_id },
      order: [['due_date', 'ASC']],
    });

    res.json({
      success: true,
      data: milestones,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error fetching milestones',
      error: err.message,
    });
  }
});

// ➕ Create a new project
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const { name, description, location, status } = req.body;
    const userId = req.user.user_id; // ✅ from token

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const newProject = await Project.create({
      name,
      description,
      location,
      status,
      user_id: userId,
    });

    res.status(201).json({ project: newProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating project", error });
  }
});

// ✏️ Update project (only if owned by user)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, status } = req.body;
    const userId = req.user.user_id; // ✅ from token

    const project = await Project.findOne({ where: { id, user_id: userId } });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or unauthorized",
      });
    }

    // Update fields
    project.name = name || project.name;
    project.description = description || project.description;
    project.location = location || project.location;
    project.status = status || project.status;

    await project.save();
    res.status(200).json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating project", error });
  }
});

// ❌ Delete project (only if owned by user)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id; // ✅ from token

    const project = await Project.findOne({ where: { id, user_id: userId } });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or unauthorized",
      });
    }

    await project.destroy();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting project", error });
  }
});

router.post('/:project_id/chat', authenticateToken, async (req, res) => {
  const { project_id } = req.params;
  const { message } = req.body;
  const sender_id = req.user.user_id;

  try {
    // Check if user is in the project team
    // const isMember = await ProjectTeam.findOne({
    //   where: {
    //     project_id,
    //     team_member_id: sender_id,
    //   }
    // });

    // if (!isMember) {
    //   return res.status(403).json({ success: false, message: 'Access denied' });
    // }

    const chat = await ProjectTeamChat.create({
      project_id,
      sender_id,
      message
    });

    res.json({ success: true, data: chat });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Message send failed', error: err.message });
  }
});
router.get('/:project_id/chat', authenticateToken, async (req, res) => {
  const { project_id } = req.params;
  const user_id = req.user.user_id;

  try {
    // Check team membership
    // const isMember = await ProjectTeam.findOne({
    //   where: {
    //     project_id,
    //     team_member_id: user_id,
    //   }
    // });

    // if (!isMember) {
    //   return res.status(403).json({ success: false, message: 'Access denied' });
    // }

    // Get all messages
    const rawMessages = await ProjectTeamChat.findAll({
      where: { project_id },
      order: [['created_at', 'ASC']]
    });

    // Manually fetch user info for each message
    const enrichedMessages = await Promise.all(rawMessages.map(async msg => {
      const user = await User.findByPk(msg.sender_id, {
        attributes: ['id', 'username', 'profile_pic_url']
      });
      return {
        id: msg.id,
        message: msg.message,
        created_at: msg.created_at,
        sender: user  // manually attached
      };
    }));

    res.json({ success: true, data: enrichedMessages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load chat', error: err.message });
  }
});


router.post("/create-milestone", authenticateToken, async (req, res) => {
  try {
    const { title, description, due_date,project_id,status } = req.body;
    const userId = req.user.user_id; // ✅ from token


    const newProject = await Milestone.create({
      title,
      project_id,
      description,
      due_date,
      status:"pending",
      user_id: userId,
    });

    res.status(201).json({ newProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating project", error });
  }
});

router.put("/milestone/:id/complete", authenticateToken, async (req, res) => {
  try {
    const milestoneId = req.params.id;

    // 🔒 Optional: ensure the milestone belongs to the authenticated user
    const milestone = await Milestone.findOne({
      where: {
        id: milestoneId,
        user_id: req.user.user_id,
      },
    });

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    // ✅ Update the milestone status to "complete"
    milestone.status = "complete";
    await milestone.save();

    res.json({ message: "Milestone marked as complete", milestone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating milestone", error });
  }
});

router.post("/add-project-member", authenticateToken, async (req, res) => {
  try {
    const { team_member_id, role,project_id } = req.body;
    const userId = req.user.user_id; // ✅ from token


    const newProject = await ProjectTeam.create({
      team_member_id,
      role,
      project_id,
      user_id: userId,
    });

    res.status(201).json({ project: newProject });
  } catch (error) {
    console.error("CREATE PROJECT TEAM ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error creating project",
      error: error.message || error
    });
  }
});

router.get('/project-members/:project_id', authenticateToken, async (req, res) => {
  const { project_id } = req.params;

  try {
    // Step 1: Get all team member entries for this project
    const teamMembers = await ProjectTeam.findAll({
      where: { project_id },
      order: [['id', 'DESC']]
    });

    // Step 2: Fetch user details manually for each member
    const membersWithUser = await Promise.all(
      teamMembers.map(async (member) => {
        const user = await User.findByPk(member.team_member_id, {
          attributes: ['id', 'username', 'email', 'profile_pic_url']
        });

        return {
          ...member.toJSON(),
          user: user || null
        };
      })
    );

    res.json({ success: true, data: membersWithUser });
  } catch (error) {
    console.error("FETCH PROJECT MEMBERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching project members",
      error: error.message
    });
  }
});

module.exports = router;
