// models/ProjectTeamChat.js
module.exports = (sequelize, DataTypes) => {
    const ProjectTeamChat = sequelize.define('ProjectTeamChat', {
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      tableName: 'project_team_chat',
      timestamps: true,
      underscored: true
    });
  
    return ProjectTeamChat;
  };
  