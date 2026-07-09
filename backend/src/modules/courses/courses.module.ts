// ========================================================================
//? import
// ========================================================================
import { Module } from '@nestjs/common';

// services
import { CoursesService } from './courses.service';
import { CourseEnrollmentService } from './services/CourseEnrollment.service';
import { GetCurrentStudentCoursesService } from './services/GetCurrentStudentCourses.service';
// -----
import { SemestersService } from '../semesters/semesters.service';

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

//service
import { GradesService } from '../grades/grades.service';

// producer
import { GradeProducer } from '../background-jobs/producers/grade.producer';


// worker
import { GradeWorker } from '../background-jobs/workers/grade.worker';
// ========================================================================
@Module({
  imports: [
    SequelizeModule.forFeature([CoursesModel, SemestersModel, OfferedCoursesModel, AcademicRecordsModel]),
    AuthModule,
    UsersModule,

  ],
  controllers: [CoursesController],
  providers: [
    CoursesService,
    CrudHelper,
    CourseEnrollmentService,
    GetCurrentStudentCoursesService,
    GradeWorker,
    GradesService,
    GradeProducer,
    SemestersService],
  exports: [SequelizeModule, CoursesService]
})
export class CoursesModule { }
