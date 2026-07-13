export const redisConnection = {

    host: process.env.REDIS_HOST,

    port: Number(process.env.REDIS_PORT),

    password: process.env.REDIS_PASSWORD || undefined,

};
console.log(`
Redis connection:
host: ${redisConnection.host},
port: ${redisConnection.port},
`);