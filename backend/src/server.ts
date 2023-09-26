import app from "./app";
import Logger from "./utils/Logger";

const port = process.env.PORT || 5000;

app.listen(port, () => Logger.info(`REST server running at http://127.0.0.1:${port}`));
