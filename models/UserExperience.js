module.exports = (sequelize, DataTypes) => {
    const UserExperience = sequelize.define('UserExperience', {
      user_id: DataTypes.INTEGER,
      type: DataTypes.ENUM('film', 'television', 'theatre'),
      project_title: DataTypes.STRING,
      role: DataTypes.STRING,
      director: DataTypes.STRING,
      production_company: DataTypes.STRING,
      year: DataTypes.STRING,
      description: DataTypes.TEXT,
      files: DataTypes.JSON
    });
  
    return UserExperience;
  };
  