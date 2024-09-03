import { data } from "../@types/sequelize";

export interface UserLoginAttributes {
  email: string;
  password: string;
}
export interface UserCreationAttributes extends UserLoginAttributes {
  name: string;
}
export interface UserAttributes extends UserCreationAttributes {
  id: number;
}

export type UserInstance = data<UserAttributes, UserCreationAttributes>;
