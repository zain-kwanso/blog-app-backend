export interface Payload {
  id: number;
  name: string;
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      user: Payload;
    }
  }
}
