//============================================================
//? Import 
//============================================================

import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// model 
import { UsersModel } from './users.model';
import { AcademicRecordsModel } from '../academicRecords/academicRecords.model';
import { SemestersModel } from '../courses/semesters.model';
import { CoursesModule } from '../courses/courses.module';
// sequelize 
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthHelper } from '../auth/helpers/auth.helper';

//============================================================
@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthHelper],

  imports: [
    SequelizeModule.forFeature([UsersModel, AcademicRecordsModel, SemestersModel]),
  ],
  exports: [SequelizeModule, UsersService]
})
export class UsersModule { }
