import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// service
import { OfferedCoursesService } from './offered-courses.service';

// controller
import { OfferedCoursesController } from './offered-courses.controller';

// model
import { OfferedCoursesModel } from './offered-courses.model';
import { CoursesModel } from '../courses/courses.model';
import { AcademicRecordsModel } from '../academicRecords/academic-records.model';
import { SemestersModel } from '../semesters/semesters.model';
import { UsersModel } from '../users/users.model';
import { AuthModule } from '../auth/auth.module';
// ==================================================================================================
@Module({
  controllers: [OfferedCoursesController],
  providers: [OfferedCoursesService],

  imports: [
    SequelizeModule.forFeature([OfferedCoursesModel, CoursesModel, AcademicRecordsModel, SemestersModel, UsersModel]),
    AuthModule,
  ]
})
export class OfferedCoursesModule { }
