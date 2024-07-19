import { Router } from "express";
import { DeviceController } from "../controllers/DeviceController.js";

export const createDeviceRouter: ({ model }: any) => Router = ({
  model,
}: any) => {
  const deviceRouter = Router();

  const deviceController = new DeviceController({ model });

  deviceRouter.post("/", deviceController.create);

  deviceRouter.get("/", deviceController.getAll);

  deviceRouter.get("/maintenances", deviceController.getMaintenances)

  deviceRouter.get("/:id", deviceController.getById);

  deviceRouter.delete("/:id", deviceController.delete);

  deviceRouter.patch("/:id", deviceController.update);

  return deviceRouter;
};