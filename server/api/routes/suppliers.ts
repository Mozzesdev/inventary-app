import { Router } from "express";
import { SuppliersController } from "../controllers/SuppliersController.js";

export const createSuppliersRouter: ({ model }: any) => Router = ({
  model,
}: any) => {
  const suppliersRouter = Router();

  const companiesController = new SuppliersController({ model });

  suppliersRouter.post("/", companiesController.create);

  suppliersRouter.get("/", companiesController.getAll);

  suppliersRouter.get("/:id", companiesController.getById);

  suppliersRouter.delete("/files/:id", companiesController.deleteFile);

  suppliersRouter.post("/files", companiesController.addFiles);
  
  suppliersRouter.delete("/:id", companiesController.delete);

  suppliersRouter.patch("/:id", companiesController.update);

  return suppliersRouter;
};
