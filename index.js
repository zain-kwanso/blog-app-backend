import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from "./models/index.js";
import routes from "./routes/index.js";
import cors from "cors";
try {
  dotenv.config();

  const app = express();
  const PORT = process.env.PORT || 4000;

  app.use(bodyParser.json());
  app.use(cors());

  app.use("/", routes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Internal Server Error", error);
}
