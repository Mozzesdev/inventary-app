import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";

export const createUsersRouter: ({ model }: any) => Router = ({
  model,
}: any) => {
  const userRouter = Router();

  const userController = new UserController({ model });

  userRouter.get("/", userController.getAll);

  userRouter.post("/register", authenticateToken, userController.create);

  userRouter.get("/:id", authenticateToken, userController.getById);

  userRouter.delete("/:id", authenticateToken, userController.delete);

  userRouter.patch("/:id", authenticateToken, userController.update);

  userRouter.post("/login", (req, res) => {
    console.log(req.body);
    res.status(200);
    res.send("Hola");
  });

  userRouter.post("/logout", authenticateToken, userController.logout);

  userRouter.post(
    "/change-password/:id",
    authenticateToken,
    userController.changePassword
  );

  userRouter.post("/enable-2fa", authenticateToken, userController.enable2fa);

  userRouter.post("/verify-2fa", userController.verif2fa);

  return userRouter;
};
