import { createClient } from "redis";
import { REDIS_PASSWORD } from "../config.js";

const redis = await createClient({
  password: REDIS_PASSWORD,
  socket: {
    host: "redis-10075.c328.europe-west3-1.gce.redns.redis-cloud.com",
    port: 10075,
  },
})
  .on("connect", () => {
    console.log("Conexión establecida con Redis");
  })
  .on("error", async (err) => {
    console.log("Redis Client Error", err);
  })
  .connect();

export default redis;
