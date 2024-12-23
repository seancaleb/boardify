import { Request } from "express";

// declare module "express-serve-static-core" {
//   interface Request {
//     user: { email: string; role: "admin" | "user"; id: string };
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user: { email: string; role: "admin" | "user"; id: string };
    }
  }
}
