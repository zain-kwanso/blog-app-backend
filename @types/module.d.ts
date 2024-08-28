import { Request } from "express";

export interface User {
  id: number;
  name: string;
  iat: number; // Issued at time (Unix timestamp)
}

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
