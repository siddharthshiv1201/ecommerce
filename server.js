import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.static("public"));
app.use(cors());
const dbuser = encodeURIComponent(process.env.DBUSER);
const dbpass = encodeURIComponent(process.env.DBPASS);

// mongoose
//   .connect(`mongodb://localhost:27017/merncafe`)
//   .then(() => {
//     app.listen(8080, () => {
//       console.log("Server started");
//     });
//   });

  mongoose
  .connect(`mongodb+srv://${dbuser}:${dbpass}@cluster0.mz2ddbv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(8080, () => {
      console.log("Server started");
    });
  });

app.use(express.json());

app.use("/api/users", userRouter);
