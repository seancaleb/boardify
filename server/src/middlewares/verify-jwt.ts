import { ACCOUNT_NOT_FOUND, FORBIDDEN, UNAUTHORIZED } from "@/constants";
import User from "@/models/user.model";
import config from "config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { ObjectId } from "mongoose";

const ACCESS_TOKEN = config.get<string>("accessToken");

export const verifyJwt = (req: Request, res: Response, next: NextFunction): any => {
  const cookies = req.cookies;

  if (!cookies["jwt-token"]) {
    return res.status(401).json({ message: UNAUTHORIZED });
  }

  const token = cookies["jwt-token"] as string;

  jwt.verify(token, ACCESS_TOKEN, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: FORBIDDEN });
    }

    const { id } = decoded as { id: ObjectId };

    // Check if user exists in database
    const user = await User.findById(id).lean();

    if (!user) {
      return res.status(404).json({ message: ACCOUNT_NOT_FOUND });
    }

    req.user = { id: _.toString(id), email: user.email, role: user.role };
    next();
  });
};
