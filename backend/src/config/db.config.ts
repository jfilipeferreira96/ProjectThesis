import path from "path";
import dotenv from "dotenv";

const fullPath = path.dirname(require.main!.filename);
dotenv.config({ path: path.join(fullPath + "/", ".env") });

interface Config {
  local: {
    localUrlDatabase: string;
    secret: string;
  };
}

const config: Config = {
  local: {
    localUrlDatabase: process.env.DB_URI!,
    secret: process.env.SECRET_KEY!,
  },
};

export default config;
