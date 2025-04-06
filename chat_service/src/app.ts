import startServer from "./infrastructure/rest/server";

import dotenv from "dotenv";

dotenv.config();

startServer().catch(console.error);
