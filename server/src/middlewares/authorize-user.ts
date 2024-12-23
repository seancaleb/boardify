import { FORBIDDEN } from "@/constants";
import { Role } from "@/types";
import { NextFunction, Request, Response } from "express";

export const authorizeUser =
  (accessType: Role) =>
  (req: Request, res: Response, next: NextFunction): any => {
    const { role } = req.user;

    if (accessType === "admin") {
      return accessType === role ? next() : res.status(403).json({ message: FORBIDDEN });
    } else {
      return accessType === role ? next() : res.status(403).json({ message: FORBIDDEN });
    }
  };
