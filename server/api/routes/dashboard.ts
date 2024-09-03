import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";

export const createDashboardRouter: ({ model }: any) => Router = ({
  model,
}: any) => {
  const dashboardRouter = Router();

  const dashboardController = new DashboardController({ model });

  dashboardRouter.get("/devices", dashboardController.getDevices);
  dashboardRouter.get("/counters", dashboardController.getCounters)

  return dashboardRouter;
};