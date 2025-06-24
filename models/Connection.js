module.exports = (sequelize, DataTypes) => {
    const Connection = sequelize.define('Connection', {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      connected_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'connected_user_id']
        }
      ]
    });
  
    return Connection;
  };
  