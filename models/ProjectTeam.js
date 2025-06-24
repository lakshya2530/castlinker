// models/ProjectTeam.js
module.exports = (sequelize, DataTypes) => {
    const ProjectTeam = sequelize.define('ProjectTeam', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      team_member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'project_teams',
      timestamps: true,
      underscored: true,
    });
  
    return ProjectTeam;
  };
  