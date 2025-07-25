// models/Milestone.js
module.exports = (sequelize, DataTypes) => {
    const Milestone = sequelize.define('Milestone', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      due_date: {
        type: DataTypes.DATE,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'milestones',
      timestamps: true,
      underscored: true,
    });
  
    return Milestone;
  };
  