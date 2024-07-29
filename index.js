import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from "./models/index.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

// Use the imported routes
app.use("/", routes);

const dbSync = async () => {
  try {
    await db.sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

dbSync();
