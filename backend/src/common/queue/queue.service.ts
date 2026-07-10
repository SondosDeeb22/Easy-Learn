import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import { redisConnection } from './redis.constants';

// =======================================================
@Injectable()
export class QueueService {

    createQueue(name: string) {
        console.log(`
            host: ${process.env.REDIS_HOST},
            port: ${process.env.REDIS_PORT},
            user: ${process.env.REDIS_USER},
            password: ${process.env.REDIS_PASSWORD ? "FOUND" : "MISSING"},
        `);

        return new Queue(name, {

            connection: redisConnection,

        });

    }

}