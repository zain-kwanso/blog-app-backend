export default (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    commentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    postID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Posts",
        key: "postID",
      },
    },
    parentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Comments",
        key: "commentID",
      },
    },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: "userID",
    });

    Comment.belongsTo(models.Post, {
      foreignKey: "postID",
    });

    Comment.belongsTo(models.Comment, {
      as: "parentComment",
      foreignKey: "parentID",
    });

    Comment.hasMany(models.Comment, {
      as: "replies",
      foreignKey: "parentID",
      onDelete: "CASCADE",
    });
  };

  return Comment;
};
