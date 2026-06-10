//============================================================
//? Import 
//============================================================

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// model 
import { User } from './users.model';

// sequelize 
import { SequelizeModule } from '@nestjs/sequelize';

//============================================================
@Module({
  controllers: [UsersController],
  providers: [UsersService],

  imports: [
    SequelizeModule.forFeature([User])
  ],
  exports: [SequelizeModule]
})
export class UsersModule { }
