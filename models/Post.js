module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
      title: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
      category: DataTypes.STRING,
      media: DataTypes.STRING,
      event_date: DataTypes.DATE,
      external_url: DataTypes.STRING,
      pincode: DataTypes.STRING,
      tags: DataTypes.TEXT, // Store as comma-separated string
      place_name: DataTypes.STRING,
      location: DataTypes.STRING,
      landmark: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    }, {
      tableName: 'posts',
      underscored: true,
      timestamps: true,
    });
  
    return Post;
  };
  