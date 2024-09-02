import { Model } from "sequelize";

export type data<T, U> = Model<T, U> & T;
