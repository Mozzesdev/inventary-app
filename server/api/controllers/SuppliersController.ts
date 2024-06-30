import { Request, Response } from "express";
import {
  validateLocation,
  validatePartialLocation,
} from "../schemas/location.js";
import { Model } from "../interface/model.js";

export class SuppliersController {
  model: Model;

  constructor({ model }: any) {
    this.model = model;
  }

  getAll = async (req: Request, res: Response) => {
    const result = await this.model.getAll(req.query);
    res.status(201).json(result);
  };

  create = async (req: Request, res: Response) => {
    const validated = validateLocation(req.body);

    if (!validated.success)
      return res
        .status(400)
        .json({ error: JSON.parse(validated.error.message) });

    const result = await this.model.create({ input: validated.data });

    res.status(201).json(result);
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
