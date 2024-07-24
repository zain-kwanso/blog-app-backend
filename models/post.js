module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    postID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "userID",
      },
    },
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: "userID",
    });

    Post.hasMany(models.Comment, {
      foreignKey: "postID",
      onDelete: "CASCADE",
    });
  };

  return Post;
};
