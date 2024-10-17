import { data } from "../@types/sequelize";

export interface UserLoginAttributes {
  email: string;
  password: string;
}
export interface UserCreationAttributes extends UserLoginAttributes {
  name: string;
}

export interface User {
  email: string;
  password: string;
  name: string;
  id: number;
}

export type UserInstance = data<User, UserCreationAttributes>;
