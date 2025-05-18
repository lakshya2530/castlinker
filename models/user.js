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
      },
      user_role: {
        type: DataTypes.STRING,
       // allowNull: false,
      },
      user_type: {
        type: DataTypes.STRING,
    //    allowNull: false,
      },username: {
        type: DataTypes.STRING,
       // allowNull: false,
      },bio: DataTypes.TEXT,
      age_range: DataTypes.STRING,
      weight: DataTypes.STRING,
      height: DataTypes.STRING,
      eye_color: DataTypes.STRING,
      hair_color: DataTypes.STRING,
      union_status: DataTypes.STRING,
      languages: DataTypes.STRING,
      representation: DataTypes.STRING,
      physical_attributes: {
        type: DataTypes.JSONB
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "active",
      },
      acting_skills: {
        type: DataTypes.JSONB
      },
      technical_skills: {
        type: DataTypes.JSONB
      },
      special_skills: {
        type: DataTypes.JSONB
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
      
  
      //special_skills: DataTypes.TEXT
           
    }, {
      tableName: 'users'  // 👈 forces Sequelize to use lowercase 'users'
    });
  
    return User;
  };
  