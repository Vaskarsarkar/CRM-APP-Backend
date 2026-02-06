const Redis = require("ioredis");
const dotenv = require("dotenv");
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

function createRedis() {
    const client = new Redis(REDIS_URL,{
        maxRetryPerRequest: null,
        enableReadyCheck: true
    }); 
    client.on("error", (err) => {
        console.error("[Redis] error: ", err.message);
    });

    client.on("connect", () => {
        console.log("[Redis] connected");
    });

    client.on("ready", () => {
        console.log("[Redis] ready");
    });

    return client;
}


module.exports ={
    createRedis:createRedis
};