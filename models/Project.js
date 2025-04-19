// models/Project.js
module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      location: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM('Planning', 'Pre-production', 'Production', 'Post-production', 'Completed'),
        defaultValue: 'Planning',
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    Project.associate = models => {
      Project.belongsTo(models.User, { foreignKey: 'user_id' });
    };
  
    return Project;
  };
  