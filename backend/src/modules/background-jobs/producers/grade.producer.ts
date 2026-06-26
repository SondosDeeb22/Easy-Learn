import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

// constants
import { redisConnection } from '../../../common/queue/redis.constants';
import { QUEUES } from '../../../common/queue/queue.constants';

// =======================================================================

@Injectable()
export class GradeProducer {
    private queue: Queue;

    constructor() {
        // create queue
        this.queue = new Queue(QUEUES.GRADE_PROCESSING, {
            connection: redisConnection,
        });
    }

    async updateGPAAndCGPAJob(data: {
        studentId: string;
        semesterId: string;
    }) {
        await this.queue.add('update-gpa-and-cgpa', data, { // here we're storing data for redis
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 3000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        });
    }
}