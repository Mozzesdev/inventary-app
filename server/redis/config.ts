import { createClient } from "redis";
import { REDIS_PASSWORD } from "../config";

const redis = await createClient({
  password: REDIS_PASSWORD,
  socket: {
    host: "redis-12279.c339.eu-west-3-1.ec2.redns.redis-cloud.com",
    port: 12279,
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
