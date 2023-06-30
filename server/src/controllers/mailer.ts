import { GMAIL_ID, GMAIL_PASSWORD } from "../config";

const nodemailer = require('nodemailer');
 
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_ID,
        pass: GMAIL_PASSWORD
    }
});



export const sendOtpMail = (data:any, otp:any)=>{
  let mailDetails = {
    from: GMAIL_ID,
    to: data.email,
    subject: 'Tasker - Password Reset OTP',
    text: `Your OTP for password reset is ${otp}`
  };
  mailTransporter.sendMail(mailDetails, function(error:any, data:any) {
    if(error) {
        console.log('Error Occurs');
    } else {
        console.log('Email sent successfully');
    }
  });
}


