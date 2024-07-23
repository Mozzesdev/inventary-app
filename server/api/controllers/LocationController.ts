import { Request, Response } from "express";
import {
  validateLocation,
  validatePartialLocation,
} from "../schemas/location.js";

export class LocationController {
  model: any;

  constructor({ model }: any) {
    this.model = model;
  }

  getAll = async (req: Request, res: Response) => {
    const result = await this.model.getAll(req.query);
    res.status(201).json(result);
  };

  deleteFile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { statusCode, ...result }: any = await this.model.deleteFile({ id });

    res.status(statusCode).send(result);
  };

  create = async (req: Request, res: Response) => {
    const validated = validateLocation(req.body);

    if (!validated.success)
      return res
        .status(400)
        .json({ error: JSON.parse(validated.error.message) });

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
    const result: any = await this.model.delete({ id });

    res.status(201).send(result);
  };

  update = async (req: Request, res: Response) => {
    const validated = validatePartialLocation(req.body);

    if (!validated.success)
      return res
        .status(400)
        .json({ error: JSON.parse(validated.error.message) });

    const { id } = req.params;

    const result: any = await this.model.update({
      id,
      input: validated.data,
    });

    res.status(201).send(result);
  };
}
