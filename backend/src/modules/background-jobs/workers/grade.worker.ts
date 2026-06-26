import { Injectable } from '@nestjs/common';
import { Worker, Job } from 'bullmq';

// constants
import { redisConnection } from '../../../common/queue/redis.constants';
import { QUEUES } from '../../../common/queue/queue.constants';

// services 
import { GradesService } from '../../grades/grades.service';

// ================================================================================
@Injectable()
export class GradeWorker {
    private worker: Worker;

    constructor(
        private readonly gpaService: GradesService,
    ) {
        this.worker = new Worker(
            QUEUES.GRADE_PROCESSING, // queue name
            async (job: Job) => {// send new jobs to process method
                await this.process(job);
            },
            {
                connection: redisConnection, // redis connection data
            },
        );
    }

    // ----------------------------------------------------
    private async process(job: Job) {
        const { studentId, semesterId } = job.data;

        // calculate GPA for semester and CGPA
        await this.gpaService.upsertGPAAndUpdateCGPA(
            studentId,
            semesterId
        );
    }
}