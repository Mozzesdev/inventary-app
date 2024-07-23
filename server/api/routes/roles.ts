import { Router } from "express";
import { RolesController } from "../controllers/RolesController";

export const createRolesRouter: ({ model }: any) => Router = ({
    model,
  }: any) => {
    const rolesRouter = Router();
  
    const rolesController = new RolesController({ model });
  
    rolesRouter.post("/", rolesController.create);
  
    rolesRouter.get("/", rolesController.getAll);
  
    rolesRouter.get("/:id", rolesController.getById);

    rolesRouter.delete("/files/:id", rolesController.deleteFile);
  
    rolesRouter.delete("/:id", rolesController.delete);
  
    rolesRouter.patch("/:id", rolesController.update);
  
    return rolesRouter;
  };
  