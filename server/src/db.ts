
const dotenv =require("dotenv");
// const {mongoose} = require("mongoose");
dotenv.config();
import mongoose from "mongoose";
import { MONGO_URI } from "./config";


// export const dbConnection = () =>
//   new Promise((resolve, reject) => {
//     mongoose.connect(process.env.DB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   const db = mongoose.connection;
//   db.on("error", () => {
//     console.error.bind(console, "connection error:");
//       reject(
//         new Error(
//           "Connection error has occurred when trying to connect to the database!"
//       )
//     );
//   });
//   db.once("open", () => resolve("🚀 Successful database connection."));
// });

const connectDB = async () => {
  try {
      const conn = await mongoose.connect(MONGO_URI);
      console.log(`🚀 Database connection Successful: ${conn.connection.host}`);
  } catch (error) {
      console.log(error);
      process.exit(1);
  }
};

export default connectDB;