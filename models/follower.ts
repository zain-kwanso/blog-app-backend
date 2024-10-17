import { FollowerInstance, FollowerType } from "../@types/models/follower";
import sequelize from "../sequelize/config.ts";
import { DataTypes } from "sequelize";

const Follower = sequelize.define<FollowerInstance>("Followers", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  BloggerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Follower;
