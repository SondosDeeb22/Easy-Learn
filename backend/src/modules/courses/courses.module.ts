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
import { SemestersModel } from '../semesters/semesters.model';
import { OfferedCoursesModel } from '../offered-courses/offered-courses.model';
import { AcademicRecordsModel } from '../academicRecords/academic-records.model';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

//helper
import { CrudHelper } from 'src/common/helpers/crud.helper';
// ========================================================================
@Module({
  imports: [
    SequelizeModule.forFeature([CoursesModel, SemestersModel, OfferedCoursesModel, AcademicRecordsModel]),
    AuthModule,
    UsersModule,

  ],
  controllers: [CoursesController],
  providers: [CoursesService, CrudHelper],
  exports: [SequelizeModule, CoursesService]
})
export class CoursesModule { }
