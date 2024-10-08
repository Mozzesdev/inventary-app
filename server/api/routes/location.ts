import { Router } from "express";
import { LocationController } from "../controllers/LocationController";

export const createLocationRouter: ({ model }: any) => Router = ({
  model,
}: any) => {
  const locationRouter = Router();

  const locationController = new LocationController({ model });

  locationRouter.post("/", locationController.create);

  locationRouter.get("/", locationController.getAll);

  locationRouter.get("/:id", locationController.getById);

  locationRouter.delete("/files/:id", locationController.deleteFile);

  locationRouter.post("/files", locationController.addFiles);

  locationRouter.delete("/:id", locationController.delete);

  locationRouter.patch("/:id", locationController.update);

  return locationRouter;
};
