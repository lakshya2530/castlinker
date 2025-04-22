const { Sequelize, DataTypes } = require('sequelize');

// Use dotenv to load DB credentials from .env
require('dotenv').config();

// Option 1: Use DB_URI directly
// const sequelize = new Sequelize(process.env.DB_URI);

// Option 2: Separate DB config
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
  }
);

// Initialize DB object
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Load Models
db.Job = require('./job')(sequelize, DataTypes);
db.User = require('./user')(sequelize, DataTypes);
db.Project = require('./Project')(sequelize, DataTypes);
db.Post = require('./Post')(sequelize, DataTypes);

module.exports = db;
