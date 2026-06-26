//============================================================
//? Import 
//============================================================

import { Module, forwardRef } from '@nestjs/common';
import { AcademicRecordsService } from './academic-records.service';
import { AcademicRecordsController } from './academic-records.controller';

// model 
import { UsersModel } from '../users/users.model';
import { AcademicRecordsModel } from './academic-records.model';
import { SemestersModel } from '../semesters/semesters.model';
import { CoursesModel } from '../courses/courses.model';
import { GradeScaleModel } from '../grades/grades.model';

import { GPARecordsModel } from '../grades/gpa-records.model';
// sequelize 
import { SequelizeModule } from '@nestjs/sequelize';

//helper
import { AuthHelper } from '../auth/helpers/auth.helper';

//service
import { GradesService } from '../grades/grades.service';

// producer
import { GradeProducer } from '../background-jobs/producers/grade.producer';

// worker
import { GradeWorker } from '../background-jobs/workers/grade.worker';
//============================================================
@Module({
    controllers: [AcademicRecordsController],
    providers: [AcademicRecordsService, AuthHelper, GradeProducer, GradeWorker, GradesService],

    imports: [
        SequelizeModule.forFeature([
            UsersModel,
            AcademicRecordsModel,
            SemestersModel,
            CoursesModel,
            GradeScaleModel,
            GPARecordsModel
        ]),
    ],
    exports: [SequelizeModule, AcademicRecordsService]
})
export class AcademicRecordsModule { }
