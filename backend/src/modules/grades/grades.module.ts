import { Module } from '@nestjs/common';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';

import { SequelizeModule } from '@nestjs/sequelize';

// models
import { GradeScaleModel } from './grades.model';

// ===============================================================

@Module({
  controllers: [GradesController],
  providers: [GradesService],

  imports: [SequelizeModule.forFeature([GradeScaleModel])],

  exports: [SequelizeModule]
})
export class GradesModule { }
