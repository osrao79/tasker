"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpMail = void 0;
const config_1 = require("../config");
const nodemailer = require('nodemailer');
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config_1.GMAIL_ID,
        pass: config_1.GMAIL_PASSWORD
    }
});
const sendOtpMail = (data, otp) => {
    let mailDetails = {
        from: config_1.GMAIL_ID,
        to: data.email,
        subject: 'Tasker - Password Reset OTP',
        text: `Your OTP for password reset is ${otp}`
    };
    mailTransporter.sendMail(mailDetails, function (error, data) {
        if (error) {
            console.log('Error Occurs');
        }
        else {
            console.log('Email sent successfully');
        }
    });
};
exports.sendOtpMail = sendOtpMail;
