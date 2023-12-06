import * as dotenv from "dotenv";
dotenv.config();

interface Config {
  local: {
    localUrlDatabase: string;
    secret: string;
  };
}

const config: Config = {
  local: {
    localUrlDatabase: process.env.DB_URI,
    secret: process.env.SECRET_KEY,
  },
};

export default config;
