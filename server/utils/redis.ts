import { Redis } from "ioredis";
import redisCfg from "~~/config/redis.json";
import { useRuntimeConfig } from "#imports";

const config = useRuntimeConfig();
const env = config.environment as keyof typeof redisCfg;

export const redisConnection = new Redis({
  host: redisCfg[env].host,
  port: redisCfg[env].port,
  maxRetriesPerRequest: redisCfg[env].maxRetriesPerRequest,
});
