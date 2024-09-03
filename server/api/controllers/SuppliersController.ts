import { Request, Response } from "express";
import {
  validatePartialSupplier,
  validateSupplier,
  validateSupplierFiles,
} from "../schemas/supplier";

export class SuppliersController {
  model: any;

  constructor({ model }: any) {
    this.model = model;
  }

  getAll = async (req: Request, res: Response) => {
    const { statusCode, ...result } = await this.model.getAll(req.query);
    res.status(statusCode).json(result);
  };

  deleteFile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { statusCode, ...result }: any = await this.model.deleteFile({ id });

    res.status(statusCode).send(result);
  };

  create = async (req: Request, res: Response) => {
    const validated = validateSupplier(req.body);

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
    const validated = validatePartialSupplier(req.body);

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

  addFiles = async (req: Request, res: Response) => {
    const validated = validateSupplierFiles(req.body);

    if (!validated.success)
      return res.status(400).json({
        error: validated.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });

    const { statusCode, ...result } = await this.model.addFiles({
      input: validated.data,
    });

    res.status(statusCode).send(result);
  };
}
