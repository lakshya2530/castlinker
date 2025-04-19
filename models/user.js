// models/user.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'users'  // 👈 forces Sequelize to use lowercase 'users'
    });
  
    return User;
  };
  