import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JSW_KEY } from "../config.js";

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(
    token,
    JSW_KEY as string,
    (err: jwt.VerifyErrors | null, user: string | JwtPayload | undefined) => {
      if (err) {
        return res.status(403).json({ error: "Failed to authenticate token" });
      }

      req.user = user;
      next();
    }
  );
};
