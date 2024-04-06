import mongoose, { ConnectOptions } from "mongoose";
import config from "./db.config";
import Logger from "../utils/logger";

const connectToDatabase = async (retryCount = 0) => {
  const options: ConnectOptions = {};
  const uris = [config.local.localUrlDatabase ?? "mongodb://localhost:27017/docker", "mongodb://mongo:27017/docker", "mongodb://127.0.0.1:27017/docker"];

  mongoose.set("strictQuery", true);

  try {
    const uri = uris[retryCount];
    const db = await mongoose.connect(uri, options);
    Logger.info(`Connected to Database: ${db.connections[0].name}`);
  } catch (error) {
    Logger.error(`Not Connected to Database ERROR! ${error}`);
    if (retryCount < uris.length - 1) {
      // Retry with the next URI
      await connectToDatabase(retryCount + 1);
    } else {
      Logger.error("Failed to connect to any of the databases.");
    }
  }
};

export default connectToDatabase;
