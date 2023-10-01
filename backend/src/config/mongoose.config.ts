import mongoose, { ConnectOptions } from "mongoose";
import config from "./db.config";
import Logger from "../utils/Logger";
import { Db } from "mongodb";

const connectToDatabase = async () => {
  const options: ConnectOptions = {};
  const uri = config.local.localUrlDatabase;
  
  mongoose.set("strictQuery", true);

  try {
    const db = await mongoose.connect(uri, options);
    Logger.info(`Connected to Database: ${db.connections[0].name}`);
  } catch (error) {
    Logger.error(`Not Connected to Database ERROR! ${error}`);
  }
};

export default connectToDatabase;
