import cors from "cors";
import { ACCEPT_ORIGINS } from "../config";

export const corsMiddleware = ({ acceptOrigins = ACCEPT_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (!origin || acceptOrigins?.includes(origin))
        return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  });
