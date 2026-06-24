import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

// models
import { UsersModel } from '../modules/users/users.model';
import { CoursesModel } from 'src/modules/courses/courses.model';
import { SemestersModel } from 'src/modules/semesters/semesters.model';
import { OfferedCoursesModel } from 'src/modules/offered-courses/offered-courses.model';
import { AcademicRecordsModel } from 'src/modules/academicRecords/academic-records.model';
import { GradeScaleModel } from 'src/modules/grades/grades.model';
import { GPARecordsModel } from 'src/modules/grades/gpa-records.model';

// samples
import { sampleUsers } from './samples/users.sample';
import { sampleCourses } from './samples/courses.sample';
import { sampleSemesters } from './samples/semesters.sample';
import { sampleOfferedCourses } from './samples/offered-courses.sample';
import { sampleAcademicRecords } from './samples/academic-records.sample';
import { sampleGrades } from './samples/grades.sample';
import { sampleGPARecords } from './samples/gpa-recordsSample';

// ======================================================================

@Injectable()
export class SeedService {
    constructor(
        @InjectModel(UsersModel)
        private readonly userModel: typeof UsersModel,
        @InjectModel(CoursesModel)
        private readonly coursesModel: typeof CoursesModel,
        @InjectModel(SemestersModel)
        private readonly semestersModel: typeof SemestersModel,
        @InjectModel(OfferedCoursesModel)
        private readonly offeredCoursesModel: typeof OfferedCoursesModel,
        @InjectModel(AcademicRecordsModel)
        private readonly academicRecordsModel: typeof AcademicRecordsModel,
        @InjectModel(GradeScaleModel)
        private readonly gradeScaleModel: typeof GradeScaleModel,
        @InjectModel(GPARecordsModel)
        private readonly gpaRecordsModel: typeof GPARecordsModel,
    ) { }

    async seed() {
        // Clear existing data- children then parents
        await this.gpaRecordsModel.destroy({ where: {} });
        await this.academicRecordsModel.destroy({ where: {} });
        await this.gradeScaleModel.destroy({ where: {} });
        await this.offeredCoursesModel.destroy({ where: {} });
        await this.coursesModel.destroy({ where: {} });
        await this.semestersModel.destroy({ where: {} });
        await this.userModel.destroy({ where: {} });

        //seed data - parents then children
        await this.userModel.bulkCreate(sampleUsers as any);
        await this.semestersModel.bulkCreate(sampleSemesters as any);
        await this.coursesModel.bulkCreate(sampleCourses as any);
        await this.offeredCoursesModel.bulkCreate(sampleOfferedCourses as any);
        await this.gradeScaleModel.bulkCreate(sampleGrades as any);
        await this.academicRecordsModel.bulkCreate(sampleAcademicRecords as any);
        await this.gpaRecordsModel.bulkCreate(sampleGPARecords as any);
    }

}




