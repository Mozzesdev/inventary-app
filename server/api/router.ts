import express, { Router } from "express";
import { createLocationRouter } from "./routes/location.js";
import { createUsersRouter } from "./routes/user.js";
import { createSuppliersRouter } from "./routes/suppliers.js";
import locationModel from "./models/mysql/locations.js";
import supplierModel from "./models/mysql/suppliers.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { createFilesRouter } from "./routes/files.js";
import { createDeviceRouter } from "./routes/device.js";
import deviceModel from "./models/mysql/device.js";
import { createDashboardRouter } from "./routes/dashboard.js";
import DashboardModel from "./models/mysql/dashboard.js";
import compression from "compression";
import userModel from "./models/mysql/users.js";
import morgan from "morgan";
import { createRolesRouter } from "./routes/roles.js";
import roleModel from "./models/mysql/role.js";

const apiRouter: Router = Router();

const locationRouter = createLocationRouter({ model: locationModel });
const usersRouter = createUsersRouter({ model: userModel });
const suppliersRouter = createSuppliersRouter({ model: supplierModel });
const filesRouter = createFilesRouter();
const deviceRouter = createDeviceRouter({ model: deviceModel });
const dashboardRouter = createDashboardRouter({ model: DashboardModel });
const roleRouter = createRolesRouter({ model: roleModel });

apiRouter.use(compression());
apiRouter.use(express.urlencoded({ extended: true }));
apiRouter.use(express.json());
apiRouter.use(morgan("dev"));

apiRouter.get("/", (_req, res) => {
  res.redirect("/");
});

apiRouter.use("/location", authenticateToken, locationRouter);

apiRouter.use("/user", usersRouter);

apiRouter.use("/suppliers", authenticateToken, suppliersRouter);

apiRouter.use("/devices", authenticateToken, deviceRouter);

apiRouter.use("/files", authenticateToken, filesRouter);

apiRouter.use("/dashboard", authenticateToken, dashboardRouter);

apiRouter.use("/role", authenticateToken, roleRouter);

export default apiRouter;
