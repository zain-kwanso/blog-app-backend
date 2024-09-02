export interface User {
  id: number;
  name: string;
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
