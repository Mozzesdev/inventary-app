import express, { Router } from "express";
import { createLocationRouter } from "./routes/location";
import { createUsersRouter } from "./routes/user";
import { createSuppliersRouter } from "./routes/suppliers";
import locationModel from "./models/mysql/locations";
import supplierModel from "./models/mysql/suppliers";
import { authenticateToken } from "../middlewares/auth.middleware";
import { createFilesRouter } from "./routes/files";
import { createDeviceRouter } from "./routes/device";
import deviceModel from "./models/mysql/device";
import { createDashboardRouter } from "./routes/dashboard";
import DashboardModel from "./models/mysql/dashboard";
import compression from "compression";
import userModel from "./models/mysql/users";
import morgan from "morgan";
import { createRolesRouter } from "./routes/roles";
import roleModel from "./models/mysql/role";
import axios from "axios";

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

apiRouter.post("/proxy/download", authenticateToken, async (req, res) => {
  const { url } = req.body;

  try {
    const response = await axios({
      url,
      responseType: 'stream',
    });

    response.data.pipe(res);
  } catch (err) {
    res.status(500).send('Error downloading the image');
  }
});

apiRouter.use("/location", authenticateToken, locationRouter);

apiRouter.use("/user", usersRouter);

apiRouter.use("/suppliers", authenticateToken, suppliersRouter);

apiRouter.use("/devices", authenticateToken, deviceRouter);

apiRouter.use("/files", authenticateToken, filesRouter);

apiRouter.use("/dashboard", authenticateToken, dashboardRouter);

apiRouter.use("/role", authenticateToken, roleRouter);


export default apiRouter;
