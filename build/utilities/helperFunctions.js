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
exports.localVariables = exports.verifyToken = exports.generateToken = exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const config_1 = require("../config");
function hashPassword(pass) {
    const hash = bcryptjs_1.default.hashSync(pass, 10);
    return hash;
}
exports.hashPassword = hashPassword;
function comparePassword(pass, hash) {
    const result = bcryptjs_1.default.compareSync(pass, hash);
    console.log(result, "res");
    return result;
}
exports.comparePassword = comparePassword;
function generateToken(id) {
    return jsonwebtoken_1.default.sign({ id: id }, config_1.JWT_SECRET_KEY, {
        expiresIn: "1d",
    });
}
exports.generateToken = generateToken;
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const headers = req.headers["authorization"];
    // const token = headers?.split(" ")[1];
    const cookies = req.headers.cookie;
    const token = cookies === null || cookies === void 0 ? void 0 : cookies.split("=")[1];
    if (!token) {
        return res.status(401).send({ auth: false, message: "Token not provided" });
    }
    jsonwebtoken_1.default.verify(String(token), config_1.JWT_SECRET_KEY, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res
                .status(401)
                .send({ auth: false, message: "Failed to authenticate the error" });
        }
        try {
            let userFound = yield User_1.UserModel.findOne({ _id: decoded.id });
            if (!userFound)
                return res
                    .status(404)
                    .send({ success: false, message: "No user found." });
            req.user = userFound;
            next();
        }
        catch (err) {
            return res
                .status(500)
                .send({
                success: false,
                message: "There was a problem finding the user.",
            });
        }
    }));
});
exports.verifyToken = verifyToken;
const localVariables = (req, res, next) => {
    req.app.locals = {
        OTP: null,
        resetSession: false,
    };
    next();
};
exports.localVariables = localVariables;
