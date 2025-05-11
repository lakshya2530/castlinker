const express = require('express');
const router = express.Router();
const { User, Job, Application, Event } = require('../models');
const { Op, Sequelize } = require('sequelize');
const authenticateAdmin = require('../middleware/auth'); // custom middleware to check admin

//router.use(authenticateAdmin); // protect all routes with admin check

// GET /admin/stats → Total Users, Active Jobs, Applications, Events
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeJobs = await Job.count({ where: { status: 'active' } });
    const applicationsLast30Days = await Application.count({
      where: {
        createdAt: { [Op.gte]: Sequelize.literal("NOW() - INTERVAL '30 days'") },
      },
    });
    // const eventsThisMonth = await Event.count({
    //   where: Sequelize.where(
    //    // Sequelize.fn('date_part', 'month', Sequelize.col('scheduled_at')),
    //     new Date().getMonth() + 1
    //   ),
    // });

    res.json({
      totalUsers,
      activeJobs,
      applicationsLast30Days,
    //  eventsThisMonth,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
