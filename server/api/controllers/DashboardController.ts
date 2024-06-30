import { Request, Response } from "express";

export class DashboardController {
  model: any;

  constructor({ model }: any) {
    this.model = model;
  }

  getDevices = async (_req: Request, res: Response) => {
    const { statusCode, ...result } = await this.model.getDevices();

    res.status(statusCode).json(result);
  };

  getCounters = async (_req: Request, res: Response) => {
    const { statusCode, ...result } = await this.model.getCounters();

    res.status(statusCode).json(result);
  };
}
