import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./src/routes/users.js";
import itemsRouter from "./src/routes/items.js";
import inventoriesRouter from "./src/routes/inventories.js";
import "dotenv/config";

const app = express();

app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGO_DB_CONNECTION)
  .then(console.log("Connected to DB!"))
  .catch((err) => {
    console.log(err);
  });

app.use("/users", userRouter);
app.use("/items", itemsRouter);
app.use("/inventories", inventoriesRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
