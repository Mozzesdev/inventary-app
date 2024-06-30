import { Router } from "express";
import { FilesController } from "../controllers/FilesController.js";
import multer from "multer";

export const createFilesRouter: () => Router = () => {
  const filesRouter = Router();
  const upload = multer({ storage: multer.memoryStorage() });

  const filesController = new FilesController();

  filesRouter.post("/", upload.array("files", 3), filesController.upload);

  filesRouter.delete("/:name", filesController.delete);

  return filesRouter;
};
