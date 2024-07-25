import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from "./models/index.js";
import routes from "./routes/index.js"; // Import your routes from a centralized routes file

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

// event driven architecture
// Common JS Module
// compilation, built in modules
// javascript runtime environmeent
// examples of Non blocking and blocking operations
// multiple threads in Node js
// remove comparison of framework
// middleware with Express, error handling globally, valiators
// body parsers (part of middleware) req, res cycle
// CORS, Routing, Configurations of ENV variables and dbs etc.
// How to generate builds
// node modules stucture
// package.json and package-lock json
// connections creation what is ORM, Mainly Sequelize
// Authenticaiton section: Middleware
// function generator concept, yeild
// import export concept //meiator function

// application should not crash......

// Node js
// Express
// ORM
