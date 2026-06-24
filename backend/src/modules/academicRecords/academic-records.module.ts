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
// sequelize 
import { SequelizeModule } from '@nestjs/sequelize';

//helper
import { AuthHelper } from '../auth/helpers/auth.helper';
//============================================================
@Module({
    controllers: [AcademicRecordsController],
    providers: [AcademicRecordsService, AuthHelper],

    imports: [
        SequelizeModule.forFeature([UsersModel, AcademicRecordsModel, SemestersModel, CoursesModel, GradeScaleModel]),
    ],
    exports: [SequelizeModule, AcademicRecordsService]
})
export class AcademicRecordsModule { }
