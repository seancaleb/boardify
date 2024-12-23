import { log } from "@/utils/log";
import config from "config";
import mongoose from "mongoose";

const MONGO_PATH = config.get<string>("mongoPath");

export const connect = async () => {
  try {
    await mongoose.connect(MONGO_PATH);
    log.info("Connected to database");
  } catch (error) {
    log.info(error);
    log.info("Could not connect to database");
  }
};
