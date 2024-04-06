import mongoose, { ConnectOptions } from "mongoose";
import config from "./db.config";
import Logger from "../utils/logger";

const connectToDatabase = async (retryCount = 0) => {
  const options: ConnectOptions = {};
  const uri = config.local.localUrlDatabase ?? "mongodb://mongodb:27017/docker";

  mongoose.set("strictQuery", true);

  try {
    const db = await mongoose.connect(uri, options);
    Logger.info(`Connected to Database: ${db.connections[0].name}`);
  } catch (error) {
    Logger.error(`Not Connected to Database ERROR! ${error}`);
  }
};

export default connectToDatabase;
