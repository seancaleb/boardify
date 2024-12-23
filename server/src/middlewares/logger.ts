import { log } from "@/utils/log";
import { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  log.info(`${req.method}\t${req.url}`);
  next();
};
