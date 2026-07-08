import express from "express";
import mongoose from "mongoose";
import { config } from "./config";

const app = express();

const connectDB = async () => {
  await mongoose.connect(`${config.MONGODB_URI}/${config.DB_NAME}`);
};
connectDB()
  .then(() => {
    app.listen(config.PORT, () => {
      console.log(`Server is listening on port:${config.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection failed!!", error);
    process.exit(1);
  });

app.use(express.json());

//routes
import userRouter from "./routes/user.js";
import accountRouter from "./routes/account.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);
