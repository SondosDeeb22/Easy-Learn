import { Module } from '@nestjs/common';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';

import { SequelizeModule } from '@nestjs/sequelize';

// models
import { GradeScaleModel } from './grades.model';
import { GPARecordsModel } from './gpa-records.model';
import { AcademicRecordsModel } from '../academicRecords/academic-records.model';
import { CoursesModel } from '../courses/courses.model';
import { SemestersModel } from '../semesters/semesters.model';
import { UsersModel } from '../users/users.model';
// ===============================================================

@Module({
  controllers: [GradesController],
  providers: [GradesService],

  imports: [SequelizeModule.forFeature([
    GradeScaleModel,
    GPARecordsModel,
    AcademicRecordsModel,
    CoursesModel,
    SemestersModel,
    UsersModel
  ])],

  exports: [SequelizeModule, GradesService]
})
export class GradesModule { }
