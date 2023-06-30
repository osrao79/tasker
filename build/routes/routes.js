"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const helperFunctions_1 = require("../utilities/helperFunctions");
const mailer_1 = require("../controllers/mailer");
const router = (0, express_1.Router)();
router.post('/register', userController_1.register);
router.post('/login', userController_1.login);
router.post('/logout', helperFunctions_1.verifyToken, userController_1.logout);
router.get('/getUserProfile', helperFunctions_1.verifyToken, userController_1.getUserProfile);
router.get('/generateOTP', helperFunctions_1.verifyToken, helperFunctions_1.localVariables, userController_1.generateOTP);
router.post('/verifyOTP', helperFunctions_1.verifyToken, userController_1.verifyOTP);
router.get('/start-reset-session', helperFunctions_1.verifyToken, userController_1.startResetSession);
router.patch('/reset-password', helperFunctions_1.verifyToken, userController_1.resetPassword);
router.post('/send-otp', mailer_1.sendOtpMail);
exports.default = router;
