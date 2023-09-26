import mongoose from "mongoose";
import config from "./db.config";

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);

// Conexão à Base de Dados:
mongoose
  .connect(config.local.localUrlDatabase)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
  });
