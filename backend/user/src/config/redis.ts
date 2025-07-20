import { createClient } from "redis";
import { REDIS_URL } from "./constants.js";

const redisClient = createClient({
  url: REDIS_URL,
// url: "rediss://default:ATeEAAIjcDFkYTMzNTA5OTRjZTA0NTUwOGQ5MDU1Y2VmNmYwYTZlZXAxMA@elegant-primate-14212.upstash.io:6379",
});

redisClient
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch(console.error);


export default redisClient;
