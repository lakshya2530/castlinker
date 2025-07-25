module.exports = (sequelize, DataTypes) => {
    const PostApplication = sequelize.define('PostApplication', {
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'post_applications',
      timestamps: true,
      underscored: true
    });
  
    return PostApplication;
  };
  