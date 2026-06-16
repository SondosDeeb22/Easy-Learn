//============================================================
//? Import 
//============================================================

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// model 
import { UsersModel } from './users.model';
import { AcademicRecordsModel } from './academicRecords.model';

// sequelize 
import { SequelizeModule } from '@nestjs/sequelize';

//============================================================
@Module({
  controllers: [UsersController],
  providers: [UsersService],

  imports: [
    SequelizeModule.forFeature([UsersModel, AcademicRecordsModel])
  ],
  exports: [SequelizeModule, UsersService]
})
export class UsersModule { }
