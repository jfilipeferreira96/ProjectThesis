interface Config
{
  local: {
    localUrlDatabase: string;
    secret: string;
  };
}

const config: Config = {
  local: {
    localUrlDatabase: process.env.DB_URI! || 'mongodb://localhost:27017/thesis',
    secret: process.env.SECRET_KEY! || '123123',
  },
};

export default config;
