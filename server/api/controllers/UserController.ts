import { Request, Response } from "express";
import { Model } from "../interface/model";
import {
  validateLogin,
  validatePartialUser,
  validatePasswordChange,
  validateUser,
} from "../schemas/user";
import { NODE_ENV } from "../../config";

export class UserController {
  model: Model | any;

  constructor({ model }: any) {
    this.model = model;
  }

  deleteFile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { statusCode, ...result }: any = await this.model.deleteFile({ id });

    res.status(statusCode).send(result);
  };

  getAll = async (req: Request, res: Response) => {
    const { name } = req.query;
    const { statusCode, ...result } = await this.model.getAll({ name });
    res.status(statusCode).json(result);
  };

  create = async (req: Request, res: Response) => {
    const validated = validateUser(req.body);

    if (!validated.success)
      return res.status(400).json({
        error: validated.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });

    const { statusCode, ...result } = await this.model.create({
      input: validated.data,
    });

    res.status(statusCode).json(result);
  };

  getById = async (req: Request, res: Response) => {
    const { statusCode, ...result }: any = await this.model.getById(req.params);

    res.status(statusCode).json(result);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { statusCode, ...result }: any = await this.model.delete({ id });

    res.status(statusCode).send(result);
  };

  update = async (req: Request, res: Response) => {
    const validated = validatePartialUser(req.body);

    if (!validated.success)
      return res.status(400).json({
        error: validated.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });

    const { id } = req.params;

    const { statusCode, ...result }: any = await this.model.update({
      id,
      input: validated.data,
    });

    res.status(statusCode).send(result);
  };

  login = async (req: Request, res: Response) => {
    const validated = validateLogin(req.body);

    if (!validated.success)
      return res.status(400).json({
        error: validated.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });

    const {
      status,
      message,
      success,
      data: user,
    }: any = await this.model.login({
      input: validated.data,
    });

    res.status(status);

    if (status !== 200) {
      return res.send({ message, success, status });
    }

    if (user.two_factor) {
      return res.send({
        data: {
          "2fa_required": true,
          id: user.id,
        },
        message: "2fa is required, please put the code confirmation",
        success,
      });
    }

    res
      .cookie("access_token", user.token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .send({ message, success, data: user });
  };

  logout = async (_req: Request, res: Response) => {
    res.clearCookie("access_token");
    res.status(200).json({ message: "Logout succesfull" });
  };

  enable2fa = async (req: Request, res: Response) => {
    const { id } = req.body;

    const { message, success, statusCode, data } = await this.model.enable2fa({
      id,
    });

    res.status(statusCode).send({ message, success, data });
  };

  verif2fa = async (req: Request, res: Response) => {
    const { id, token_2fa } = req.body;

    const { message, success, statusCode, data } = await this.model.verify2fa({
      id,
      token_2fa,
    });

    if (data?.token) {
      res.cookie("access_token", data.token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      });
    }

    res.status(statusCode).send({ message, success, data });
  };

  changePassword = async (req: Request, res: Response) => {
    const validated = validatePasswordChange(req.body);

    if (!validated.success)
      return res.status(400).json({
        error: validated.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });

    const { id } = req.params;

    const { statusCode, message, success } = await this.model.changePassword({
      id,
      input: validated.data,
    });

    res.status(statusCode).send({ success, message });
  };
}
