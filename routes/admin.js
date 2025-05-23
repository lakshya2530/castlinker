const express = require('express');
const router = express.Router();
const { User, Job, Application,Post, Event,Notification } = require('../models');
const { Op, Sequelize } = require('sequelize');
const authenticateAdmin = require('../middleware/auth'); // custom middleware to check admin

//router.use(authenticateAdmin); // protect all routes with admin check

// GET /admin/stats → Total Users, Active Jobs, Applications, Events
// router.get('/stats', async (req, res) => {
//   try {
//     const now = new Date();
//     const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//     const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

//     const totalUsers = await User.count();
//     const usersLastMonth = await User.count({
//       where: {
//         createdAt: {
//           [Op.between]: [startOfLastMonth, endOfLastMonth],
//         },
//       },
//     });
//     const totalPost = await Post.count();

//     const activeJobs = await Job.count({ where: { status: 'active' } });
//     const activeJobsLastMonth = await Job.count({
//       where: {
//         status: 'active',
//         createdAt: {
//           [Op.between]: [startOfLastMonth, endOfLastMonth],
//         },
//       },
//     });
//     // const applicationsLast30Days = await Application.count({
//     //   where: {
//     //     createdAt: { [Op.gte]: Sequelize.literal("NOW() - INTERVAL '30 days'") },
//     //   },
//     // });

//     const applicationsLast30Days = await Application.count({
//       where: {
//         createdAt: {
//           [Op.gte]: Sequelize.literal("NOW() - INTERVAL '30 days'"),
//         },
//       },
//     });
//     const applicationsPrevious30Days = await Application.count({
//       where: {
//         createdAt: {
//           [Op.between]: [
//             Sequelize.literal("NOW() - INTERVAL '60 days'"),
//             Sequelize.literal("NOW() - INTERVAL '30 days'"),
//           ],
//         },
//       },
//     });
//    // const eventsThisMonth =0;
//     const eventsThisMonth = await Event.count({
//       where: {
//         createdAt: {
//           [Op.gte]: startOfThisMonth,
//         },
//       },
//     });
//     const eventsLastMonth = await Event.count({
//       where: {
//         createdAt: {
//           [Op.between]: [startOfLastMonth, endOfLastMonth],
//         },
//       },
//     });
//     const getPercentageChange = (current, previous) => {
//       if (previous === 0) {
//         return current > 0 ? 'New' : '0%';
//       }
    
//       const change = ((current - previous) / previous) * 100;
//       const rounded = Math.round(change);
    
//       return `${rounded > 0 ? '+' : ''}${rounded}%`; // adds '+' for positive numbers
//     };
    
    
//     // const eventsThisMonth = await Event.count({
//     //   where: Sequelize.where(
//     //    // Sequelize.fn('date_part', 'month', Sequelize.col('scheduled_at')),
//     //     new Date().getMonth() + 1
//     //   ),
//     // });

//     // res.json({
//     //   totalUsers,
//     //   activeJobs,
//     //   applicationsLast30Days,
//     //   eventsThisMonth,
//     //   totalPost,

//     // });

//     console.log(totalUsers, usersLastMonth);

//     res.json({
//       totalUsers,
//       usersChange: getPercentageChange(totalUsers, usersLastMonth),

//       activeJobs,
//       jobsChange: getPercentageChange(activeJobs, activeJobsLastMonth),

//       applicationsLast30Days,
//       applicationsChange: getPercentageChange(applicationsLast30Days, applicationsPrevious30Days),

//       eventsThisMonth,
//       eventsChange: getPercentageChange(eventsThisMonth, eventsLastMonth),

//       totalPost,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.get('/stats', async (req, res) => {
  try {
    const now = new Date();

    // This month range
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Last month range
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Applications range
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Total values
    const totalUsers = await User.count();
    const totalPost = await Post.count();
    const activeJobs = await Job.count({ where: { status: 'active' } });

    // This month and last month data
    const usersThisMonth = await User.count({
      where: {
        createdAt: {
          [Op.gte]: startOfThisMonth,
        },
      },
    });

    const usersLastMonth = await User.count({
      where: {
        createdAt: {
          [Op.between]: [startOfLastMonth, endOfLastMonth],
        },
      },
    });

    const activeJobsLastMonth = await Job.count({
      where: {
        status: 'active',
        createdAt: {
          [Op.between]: [startOfLastMonth, endOfLastMonth],
        },
      },
    });

    const applicationsLast30Days = await Application.count({
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
    });

    const applicationsPrevious30Days = await Application.count({
      where: {
        createdAt: {
          [Op.between]: [sixtyDaysAgo, thirtyDaysAgo],
        },
      },
    });

    const eventsThisMonth = await Event.count({
      where: {
        createdAt: {
          [Op.gte]: startOfThisMonth,
        },
      },
    });

    const eventsLastMonth = await Event.count({
      where: {
        createdAt: {
          [Op.between]: [startOfLastMonth, endOfLastMonth],
        },
      },
    });

    // Utility: Percentage Change Function
    const getPercentageChange = (current, previous) => {
      if (previous === 0) {
        return current > 0 ? 'New' : '0%';
      }

      const change = ((current - previous) / previous) * 100;
      const rounded = Math.round(change);

      return `${rounded > 0 ? '+' : ''}${rounded}%`;
    };
console.log(activeJobs, activeJobsLastMonth);
    // Final Response
    res.json({
      totalUsers,
      newUsersThisMonth: usersThisMonth,
      usersChange: getPercentageChange(usersThisMonth, usersLastMonth),

      activeJobs,
      jobsChange: getPercentageChange(activeJobs, activeJobsLastMonth),

      applicationsLast30Days,
      applicationsChange: getPercentageChange(applicationsLast30Days, applicationsPrevious30Days),

      eventsThisMonth,
      eventsChange: getPercentageChange(eventsThisMonth, eventsLastMonth),

      totalPost,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


router.get('/stats/posts-category', async (req, res) => {
  try {
    const categories = await Post.findAll({
      attributes: ['category', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
      group: ['category']
    });
    const total = categories.reduce((sum, cat) => sum + parseInt(cat.dataValues.count), 0);

    const result = categories.map(cat => ({
      category: cat.category,
      count: parseInt(cat.dataValues.count),
      percentage: ((cat.dataValues.count / total) * 100).toFixed(2)
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/stats/team-summary', async (req, res) => {
  try {
    const roles = await User.findAll({
      attributes: ['user_role', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
      group: ['user_role']
    });

    res.json(roles.map(role => ({
      role: role.user_role,
      count: parseInt(role.dataValues.count)
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats/recent-activities', async (req, res) => {
  try {
    const activities = await Notification.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
    //  attributes: ['title', 'action', 'createdAt', 'performedBy']
    });

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/user-demographics
router.get('/stats/user-demographics', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'user_role',
        [Sequelize.fn('COUNT', Sequelize.col('user_role')), 'count']
      ],
      group: ['user_role']
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


router.get('/stats/user-activity-stats', async (req, res) => {
  try {
    const stats = await User.findAll({
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')), 'month'],
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('id'))), 'activeUsers']
      ],
      group: [Sequelize.literal("DATE_TRUNC('month', \"createdAt\")")],
      order: [[Sequelize.literal("month"), 'ASC']],
      raw: true,
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/stats/job-metrics', async (req, res) => {
  try {
    const jobStats = await Job.findAll({
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('created_at')), 'month'],
        [Sequelize.fn('COUNT', '*'), 'posted']
      ],
      group: [Sequelize.literal("DATE_TRUNC('month', \"created_at\")")],
      order: [[Sequelize.literal("month"), 'ASC']],
      raw: true,
    });

    const applicationStats = await Application.findAll({
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('created_at')), 'month'],
        [Sequelize.fn('COUNT', '*'), 'applications']
      ],
      group: [Sequelize.literal("DATE_TRUNC('month', \"created_at\")")],
      order: [[Sequelize.literal("month"), 'ASC']],
      raw: true,
    });

    // Merge both datasets by month
    const mergedStats = {};

    jobStats.forEach(({ month, posted }) => {
      const key = new Date(month).toISOString().slice(0, 7);
      mergedStats[key] = { month: key, posted: parseInt(posted), applications: 0 };
    });

    applicationStats.forEach(({ month, applications }) => {
      const key = new Date(month).toISOString().slice(0, 7);
      if (!mergedStats[key]) {
        mergedStats[key] = { month: key, posted: 0, applications: parseInt(applications) };
      } else {
        mergedStats[key].applications = parseInt(applications);
      }
    });

    const result = Object.values(mergedStats).sort((a, b) => new Date(a.month) - new Date(b.month));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/job-categories
router.get('/stats/job-categories', async (req, res) => {
  try {
    const jobs = await Job.findAll({
      attributes: [
        'role_category',
        [Sequelize.fn('COUNT', Sequelize.col('role_category')), 'count']
      ],
      group: ['role_category']
    });

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});





// GET /admin/user-activity → Daily active users over time
router.get('/user-activity', async (req, res) => {
  try {
    const activity = await User.findAll({
      attributes: [
        [Sequelize.fn('date_trunc', 'day', Sequelize.col('last_login')), 'day'],
        [Sequelize.fn('count', Sequelize.col('id')), 'count'],
      ],
      where: {
        last_login: { [Op.not]: null },
      },
      group: [Sequelize.fn('date_trunc', 'day', Sequelize.col('last_login'))],
      order: [[Sequelize.literal('day'), 'ASC']],
    });

    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /admin/job-metrics → Jobs posted vs applications per month
router.get('/job-metrics', async (req, res) => {
  try {
    const postedJobs = await Job.findAll({
      attributes: [
        [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt')), 'month'],
        [Sequelize.fn('count', Sequelize.col('id')), 'posted'],
      ],
      group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt'))],
      order: [[Sequelize.literal('month'), 'ASC']],
    });
    const applications = await Application.findAll({
      attributes: [
        [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt')), 'month'],
        [Sequelize.fn('count', Sequelize.col('id')), 'applications'],
      ],
      group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt'))],
      order: [[Sequelize.literal('month'), 'ASC']],
    });

    res.json({ postedJobs, applications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
