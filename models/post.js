import sequelize from "../sequelize/config.js";
import { DataTypes } from "sequelize";

const Post = sequelize.define("Posts", {
  id: {
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
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
});

Post.associate = (models) => {
  Post.belongsTo(models.User, {
    foreignKey: "UserId",
    onDelete: "CASCADE",
  });

  Post.hasMany(models.Comment, {
    foreignKey: "PostId",
    onDelete: "CASCADE",
  });
};

export default Post;
