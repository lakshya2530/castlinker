// models/UserLike.js
module.exports = (sequelize, DataTypes) => {
    const UserLike = sequelize.define("UserLike", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      liker_id: { type: DataTypes.INTEGER, allowNull: false },
      liked_id: { type: DataTypes.INTEGER, allowNull: false }
    }, {
      tableName: "user_likes",
      timestamps: true
    });
  
    return UserLike;
  };
  