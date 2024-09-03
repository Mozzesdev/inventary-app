import { Request, Response } from "express";
import {
  validateDevice,
  validateDeviceFiles,
  validatePartialDevice,
} from "../schemas/devices";

export class DeviceController {
  model: any;

  constructor({ model }: any) {
    this.model = model;
  }

  getAll = async (req: Request, res: Response) => {
    const { statusCode, ...result } = await this.model.getAll(req.query);
    res.status(statusCode).json(result);
  };

  create = async (req: Request, res: Response) => {
    const validated = validateDevice(req.body);

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
    const result: any = await this.model.getById(req.params);

    res.status(201).json(result);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { statusCode, ...result }: any = await this.model.delete({ id });

    res.status(statusCode).send(result);
  };

  update = async (req: Request, res: Response) => {
    const validated = validatePartialDevice(req.body);

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

  getMaintenances = async (req: Request, res: Response) => {
    const { statusCode, ...result } = await this.model.getMaintenances(
      req.query
    );
    res.status(statusCode).json(result);
  };

  deleteFile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { statusCode, ...result }: any = await this.model.deleteFile({ id });

    res.status(statusCode).send(result);
  };

  addFiles = async (req: Request, res: Response) => {
    const validated = validateDeviceFiles(req.body);

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
