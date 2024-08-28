import express, { Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import routes from "./routes/index.ts";
import cors from "cors";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use(cors());

app.use("/", routes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});
