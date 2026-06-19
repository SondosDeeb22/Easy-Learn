//============================================================
//? Import 
//============================================================

import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// model 
import { UsersModel } from './users.model';
import { AcademicRecordsModel } from './academicRecords.model';
import { SemestersModel } from '../courses/semesters.model';
import { CoursesModule } from '../courses/courses.module';
// sequelize 
import { SequelizeModule } from '@nestjs/sequelize';

//============================================================
@Module({
  controllers: [UsersController],
  providers: [UsersService],

  imports: [
    SequelizeModule.forFeature([UsersModel, AcademicRecordsModel, SemestersModel])
  ],
  exports: [SequelizeModule, UsersService]
})
export class UsersModule { }
