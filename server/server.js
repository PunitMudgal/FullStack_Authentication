import express from "express";
import cors from "cors";
import morgan from "morgan";
// import dotenv from "dotenv";
import connectDb from "./config/db_connection.js";
import router from "./router/route.js";

const app = express();

/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

const port = 8080;

/** HTTP get request */
app.get("/", (req, res) => {
  res.status(201).json("hello there!!!");
});

/** api routes */
app.use("/api", router);

// starting server only when database is connected
connectDb().then(() => {
  try {
    app.listen(port, () => {
      console.log(`server started at http://localhost:${port}`);
    });
  } catch (error) {
    console.log("cannot connect to the server", error);
  }
});
