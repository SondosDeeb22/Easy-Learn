// ========================================================================
//? import
// ========================================================================
import { Module } from '@nestjs/common';

// services
import { CoursesService } from './courses.service';

// controller
import { CoursesController } from './courses.controller';

// sequelize
import { SequelizeModule } from '@nestjs/sequelize';

// models
import { CoursesModel } from './courses.model';
import { SemestersModel } from './semesters.model';
import { OfferedCoursesModel } from './offeredCourses.model';
import { AcademicRecordsModel } from '../academicRecords/academicRecords.model';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

// ========================================================================
@Module({
  imports: [
    SequelizeModule.forFeature([CoursesModel, SemestersModel, OfferedCoursesModel, AcademicRecordsModel]),
    AuthModule,
    UsersModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [SequelizeModule, CoursesService]
})
export class CoursesModule { }
