import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

//service
import { SemestersService } from './semesters.service';

//controller
import { SemestersController } from './semesters.controller';

//model
import { SemestersModel } from './semesters.model';
import { AuthModule } from '../auth/auth.module';

//==========================================================================================
@Module({
  controllers: [SemestersController],
  providers: [SemestersService],

  imports: [
    SequelizeModule.forFeature([SemestersModel]),
    AuthModule
  ]
})
export class SemestersModule { }
