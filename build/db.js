"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
// const {mongoose} = require("mongoose");
dotenv.config();
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
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
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield mongoose_1.default.connect(config_1.MONGO_URI);
        console.log(`🚀 Database connection Successful: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
exports.default = connectDB;
