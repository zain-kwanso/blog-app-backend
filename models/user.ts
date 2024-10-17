import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { UserInstance } from "../@types/models/user";
import sequelize from "../sequelize/config.ts";

const User: UserInstance = sequelize.define<UserInstance>(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
    hooks: {
      beforeCreate: async (user: typeof User) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user: typeof User) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

export default User;
