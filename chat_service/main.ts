import startServer from "./src/infrastructure/rest/server";

import dotenv from 'dotenv';

dotenv.config();

startServer().catch(console.error);