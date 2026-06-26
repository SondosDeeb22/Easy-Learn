//============================================================
//? Import 
//============================================================

import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// model 
import { UsersModel } from './users.model';
import { AcademicRecordsModel } from '../academicRecords/academic-records.model';
import { SemestersModel } from '../semesters/semesters.model';
import { CoursesModule } from '../courses/courses.module';
import { GPARecordsModel } from '../grades/gpa-records.model';
// sequelize 
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthHelper } from '../auth/helpers/auth.helper';

import { GradesModule } from '../grades/grades.module';
//============================================================
@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthHelper],

  imports: [
    SequelizeModule.forFeature([UsersModel, AcademicRecordsModel, SemestersModel, GPARecordsModel]),
    GradesModule
  ],
  exports: [SequelizeModule, UsersService]
})
export class UsersModule { }
