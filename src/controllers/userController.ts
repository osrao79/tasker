import { UserModel } from "../models/User";
import { Request, Response } from "express";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../utilities/helperFunctions";
import otpGenerator from "otp-generator";
import { sendOtpMail } from "./mailer";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    if (!email || !username || !password) {
      return res.send(400);
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.send({ message: "User already registered with this email" });
    } else {
      let newUser = {
        username,
        email,
        password: hashPassword(password),
      };
      await UserModel.create(newUser).then((result) => {
        const token = generateToken(result._id);
        res.cookie(String(result._id), token, {
          path: "/",
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
          httpOnly: true,
          sameSite: "lax",
        });
        res.send({ user: result, token: token });
      });
    }
  } catch (err) {
    res.send(err);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.send(400);
    }
    let existingUser = await UserModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(401).send({ message: "User not found" });
    }
    const isPasswordCorrect = comparePassword(password, existingUser.password);
    if (!isPasswordCorrect) {
     return res.status(401).send({ error: "Wrong username or password" });
    }
    const token = generateToken(existingUser._id);
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
  } catch (err) {
    res.send(err);
  }
};

export const logout = async (req: Request, res: Response) => {
  let user = req.user!;
  res.clearCookie(`${user._id}`, { path: "/" });
  return res.send({ message: "Logged out Successfully" });
};

export const getUserProfile = async (req: Request, res: Response) => {
  let user = req.user!;
  try {
    let userFound = await UserModel.findById(user.id, "-password");
    if (!userFound) {
      return res.status(404).send({ message: "User not Found" });
    }
    res.send(userFound);
  } catch (err) {
    res.send(400).send(err);
  }
};

export const generateOTP = async (req: Request, res: Response) => {
  let user = req.user 
  req.app.locals.OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  sendOtpMail(user,req.app.locals.OTP)
  res
    .status(201)
    .send({ message: "OTP sent successfully", OTP: req.app.locals.OTP });
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { OTP } = req.body;
  if (parseInt(req.app.locals.OTP) === parseInt(OTP)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ message: "Verification Sucessful." });
  }
  return res.status(400).send({ message: "Invalid OTP" });
};

export const startResetSession = async (req: Request, res: Response) => {
  console.log(req.app.locals);
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(201).send({ message: "Access Granted" });
  }
  return res.status(440).send({ message: "Session Expired" });
};

export const resetPassword = async (req: Request, res: Response) => {
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
    let passwordHash = hashPassword(password)
    console.log(passwordHash);
    await UserModel.findOneAndUpdate({ _id:user._id }, { password: passwordHash, });
    return res.status(200).send({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(500).send({ error });
  }
};
