import { DataTypes } from "sequelize";
import User from "./user.ts";
import Post from "./post.ts";
import Follower from "./follower.ts";
import sequelize from "../sequelize/config.ts";
const Comment = sequelize.define("Comments", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    PostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Posts",
            key: "id",
        },
    },
    ParentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "Comments",
            key: "id",
        },
    },
});
Comment.belongsTo(User, {
    foreignKey: "UserId",
    onDelete: "CASCADE",
});
Comment.belongsTo(Post, {
    foreignKey: "PostId",
    onDelete: "CASCADE",
});
Comment.belongsTo(Comment, {
    as: "parentComment",
    foreignKey: "ParentId",
    onDelete: "CASCADE",
});
Comment.hasMany(Comment, {
    as: "replies",
    foreignKey: "ParentId",
    onDelete: "CASCADE",
});
Post.belongsTo(User, {
    foreignKey: "UserId",
    onDelete: "CASCADE",
});
Post.hasMany(Comment, {
    foreignKey: "PostId",
    onDelete: "CASCADE",
});
User.hasMany(Post, {
    foreignKey: "UserId",
    onDelete: "CASCADE",
});
User.hasMany(Comment, {
    foreignKey: "UserId",
    onDelete: "CASCADE",
});
User.hasMany(Follower, {
    foreignKey: "BloggerId",
    onDelete: "CASCADE",
});
export default Comment;
