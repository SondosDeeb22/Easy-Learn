//============================================================
//? Import 
//============================================================

import { Module, forwardRef } from '@nestjs/common';
import { AcademicRecordsService } from './academicRecords.service';
import { AcademicRecordsController } from './academicRecords.controller';

// model 
import { UsersModel } from '../users/users.model';
import { AcademicRecordsModel } from '../academicRecords/academicRecords.model';
import { SemestersModel } from '../courses/semesters.model';
import { CoursesModel } from '../courses/courses.model';
// sequelize 
import { SequelizeModule } from '@nestjs/sequelize';

//helper
import { AuthHelper } from '../auth/helpers/auth.helper';
//============================================================
@Module({
    controllers: [AcademicRecordsController],
    providers: [AcademicRecordsService, AuthHelper],

    imports: [
        SequelizeModule.forFeature([UsersModel, AcademicRecordsModel, SemestersModel, CoursesModel]),
    ],
    exports: [SequelizeModule, AcademicRecordsService]
})
export class AcademicRecordsModule { }
