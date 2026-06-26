import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import { redisConnection } from './redis.constants';

// =======================================================
@Injectable()
export class QueueService {

    createQueue(name: string) {

        return new Queue(name, {

            connection: redisConnection,

        });

    }

}