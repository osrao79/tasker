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
exports.resetPassword = exports.startResetSession = exports.verifyOTP = exports.generateOTP = exports.getUserProfile = exports.logout = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const helperFunctions_1 = require("../utilities/helperFunctions");
const otp_generator_1 = __importDefault(require("otp-generator"));
const mailer_1 = require("./mailer");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        if (!email || !username || !password) {
            return res.send(400);
        }
        const existingUser = yield User_1.UserModel.findOne({ email });
        if (existingUser) {
            res.send({ message: "User already registered with this email" });
        }
        else {
            let newUser = {
                username,
                email,
                password: (0, helperFunctions_1.hashPassword)(password),
            };
            yield User_1.UserModel.create(newUser).then((result) => {
                const token = (0, helperFunctions_1.generateToken)(result._id);
                res.cookie(String(result._id), token, {
                    path: "/",
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
                    httpOnly: true,
                    sameSite: "lax",
                });
                res.send({ user: result, token: token });
            });
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.send(400);
        }
        let existingUser = yield User_1.UserModel.findOne({ email: email });
        if (!existingUser) {
            return res.status(401).send({ message: "User not found" });
        }
        const isPasswordCorrect = (0, helperFunctions_1.comparePassword)(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).send({ error: "Wrong username or password" });
        }
        const token = (0, helperFunctions_1.generateToken)(existingUser._id);
        res.cookie(String(existingUser._id), token, {
            path: "/",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
            httpOnly: true,
            sameSite: "lax",
        });
        return res.send({
            message: "Login Successful",
            user: { usename: existingUser.username, email: existingUser.email },
            token: token,
        });
    }
    catch (err) {
        res.send(err);
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    res.clearCookie(`${user._id}`, { path: "/" });
    return res.send({ message: "Logged out Successfully" });
});
exports.logout = logout;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    try {
        let userFound = yield User_1.UserModel.findById(user.id, "-password");
        if (!userFound) {
            return res.status(404).send({ message: "User not Found" });
        }
        res.send(userFound);
    }
    catch (err) {
        res.send(400).send(err);
    }
});
exports.getUserProfile = getUserProfile;
const generateOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    req.app.locals.OTP = otp_generator_1.default.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });
    (0, mailer_1.sendOtpMail)(user, req.app.locals.OTP);
    res
        .status(201)
        .send({ message: "OTP sent successfully", OTP: req.app.locals.OTP });
});
exports.generateOTP = generateOTP;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { OTP } = req.body;
    if (parseInt(req.app.locals.OTP) === parseInt(OTP)) {
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        return res.status(201).send({ message: "Verification Sucessful." });
    }
    return res.status(400).send({ message: "Invalid OTP" });
});
exports.verifyOTP = verifyOTP;
const startResetSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.app.locals);
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false;
        return res.status(201).send({ message: "Access Granted" });
    }
    return res.status(440).send({ message: "Session Expired" });
});
exports.startResetSession = startResetSession;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    let user = req.user;
    console.log(password, user);
    try {
        if (!req.app.locals.resetSession) {
            return res.status(440).send({ message: "Session Expired" });
        }
        if (!password || !user) {
            return res.send(400);
        }
        let passwordHash = (0, helperFunctions_1.hashPassword)(password);
        console.log(passwordHash);
        yield User_1.UserModel.findOneAndUpdate({ _id: user._id }, { password: passwordHash, });
        return res.status(200).send({ message: 'Password reset successful' });
    }
    catch (error) {
        return res.status(500).send({ error });
    }
});
exports.resetPassword = resetPassword;
