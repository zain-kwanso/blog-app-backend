import { data } from "../@types/sequelize";

export interface FollowerType {
  id: number;
  name: string;
  BloggerId: number;
}

export type FollowerInstance = data<FollowerType, FollowerType>;
