import { createClient } from "redis";
import { REDIS_PASSWORD } from "../config";

const redis = await createClient({
  password: REDIS_PASSWORD,
  socket: {
    host: "redis-14817.c83.us-east-1-2.ec2.redns.redis-cloud.com",
    port: 14817,
  },
})
  .on("connect", () => {
    console.log("Conexión establecida con Redis");
  })
  .on("error", async (err) => {
    console.log("Redis Client Error", err);
    process.exit();
  })
  .connect();

export default redis;
