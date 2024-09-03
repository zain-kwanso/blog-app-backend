import { Optional } from "sequelize";

export interface PostAttributes {
  id: number;
  title: string;
  content: string;
  UserId: number;
}

export interface PostCreationAttributes
  extends Optional<PostAttributes, "id" | "UserId"> {}

export type PostInstance = data<PostAttributes, PostCreationAttributes>;

import { Model, DataTypes } from "sequelize";
import sequelize from "../lib/sequelize";
import Partner from "./partner";
import { Op } from "sequelize";
import Family from "./family";
import Sibling from "./sibling";

class Lead extends Model {
  public id!: number;
  public PartnerId!: number;
  public UserId: number;
  public LeadId: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  Partner?: {
    source: string;
  };
  static associate;
}

Lead.init(
  {
    PartnerId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "PartnerId is required.",
        },
      },
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
    LeadId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
  }
);

Lead.belongsTo(Partner, { foreignKey: "PartnerId", as: "Partner" });
Partner.hasMany(Lead, { foreignKey: "PartnerId" });

export default Lead;
