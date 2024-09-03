import jwt from "jsonwebtoken";
import { JSW_KEY } from "../config";
import { NextFunction, Response } from "express";

export const userMiddleware = (
  req: any,
  _res: Response,
  next: NextFunction
) => {
  const { access_token } = req.cookies;

  if (access_token) {
    jwt.verify(
      access_token,
      JSW_KEY as string,
      (_err: jwt.VerifyErrors | null, user: any) => {
        req.user = user;
        next();
      }
    );
  } else {
    req.user = null;
    next();
  }
};
