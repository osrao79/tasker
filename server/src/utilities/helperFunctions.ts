import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User";
import { JWT_SECRET_KEY } from "../config";

export function hashPassword(pass: string): string {
  const hash = bcrypt.hashSync(pass, 10);
  return hash;
}

export function comparePassword(pass: string, hash: string): boolean {
  const result = bcrypt.compareSync(pass, hash);
  console.log(result, "res");
  return result;
}
export function generateToken(id: Types.ObjectId) {
  return jwt.sign({ id: id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const headers = req.headers["authorization"];
  // const token = headers?.split(" ")[1];
  const cookies = req.headers.cookie
  const token = cookies?.split("=")[1]

  if (!token) {
    return res.status(401).send({ auth: false, message: "Token not provided" });
  }
  jwt.verify(String(token), JWT_SECRET_KEY, async (err, decoded: any) => {
    if (err) {
      return res
        .status(401)
        .send({ auth: false, message: "Failed to authenticate the error" });
    }
    try {
      let userFound = await UserModel.findOne({ _id: decoded.id });
      if (!userFound)
        return res
          .status(404)
          .send({ success: false, message: "No user found." });
      req.user = userFound;
      next();
    } catch (err) {
      return res
        .status(500)
        .send({
          success: false,
          message: "There was a problem finding the user.",
        });
    }
  });
};


export const localVariables = (req:Request,res:Response,next:NextFunction)=>{
  req.app.locals = {
    OTP:null,
    resetSession:false,
  }
  next()
}