//============================================================
//? Import 
//============================================================

import { Module } from '@nestjs/common';

// model 
import { GPARecordsModel } from '../grades/gpa-records.model';

// sequelize 
import { SequelizeModule } from '@nestjs/sequelize';

// producer
import { GradeProducer } from './producers/grade.producer';

// worker 
import { GradeWorker } from './workers/grade.worker';


import { GradesModule } from '../grades/grades.module';

//============================================================
@Module({
    controllers: [],
    providers: [GradeProducer, GradeWorker],

    imports: [
        SequelizeModule.forFeature([GPARecordsModel]),
        GradesModule,
    ],
    exports: [SequelizeModule, GradeProducer, GradeWorker]
})
export class backgroundJobsModule { }
