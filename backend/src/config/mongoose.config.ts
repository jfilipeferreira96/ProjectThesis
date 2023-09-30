import mongoose from "mongoose";
import config from "./db.config";
import Logger from "../utils/Logger";

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);

// Conexão à Base de Dados:
mongoose
  .connect(config.local.localUrlDatabase)
  .then(() => {
    Logger.info("Connected to Database");
  })
  .catch((err) => {
    Logger.error(`Not Connected to Database ERROR! ${err}`);
  });
