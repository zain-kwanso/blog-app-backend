import sequelize from "../sequelize/config.ts";
import { DataTypes } from "sequelize";
const Follower = sequelize.define("Followers", {
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
