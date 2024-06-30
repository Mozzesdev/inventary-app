import { Router } from "express";
import { createLocationRouter } from "./routes/location.js";
import { createUsersRouter } from "./routes/user.js";
import { createSuppliersRouter } from "./routes/suppliers.js";
import locationModel from "./models/mysql/locations.js";
import userModel from "./models/mysql/users.js";
import supplierModel from "./models/mysql/suppliers.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import redis from "../redis/config.js";
import { createFilesRouter } from "./routes/files.js";
import { createDeviceRouter } from "./routes/device.js";
import deviceModel from "./models/mysql/device.js";
import { createDashboardRouter } from "./routes/dashboard.js";
import DashboardModel from "./models/mysql/dashboard.js";

const apiRouter: Router = Router();

const locationRouter = createLocationRouter({ model: locationModel });
const usersRouter = createUsersRouter({ model: userModel, redis });
const suppliersRouter = createSuppliersRouter({ model: supplierModel });
const filesRouter = createFilesRouter();
const deviceRouter = createDeviceRouter({ model: deviceModel });
const dashboardRouter = createDashboardRouter({ model: DashboardModel });

apiRouter.get("/", (_req, res) => {
  res.redirect("/");
});

apiRouter.use("/location", authenticateToken, locationRouter);

apiRouter.use("/user", usersRouter);

apiRouter.use("/suppliers", authenticateToken, suppliersRouter);

apiRouter.use("/devices", authenticateToken, deviceRouter);

apiRouter.use("/files", authenticateToken, filesRouter);

apiRouter.use("/dashboard", authenticateToken, dashboardRouter);

export default apiRouter;
