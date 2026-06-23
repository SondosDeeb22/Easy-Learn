import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

// models
import { UsersModel } from '../modules/users/users.model';
import { CoursesModel } from 'src/modules/courses/courses.model';
import { SemestersModel } from 'src/modules/semesters/semesters.model';
import { OfferedCoursesModel } from 'src/modules/offered-courses/offered-courses.model';
import { AcademicRecordsModel } from 'src/modules/academicRecords/academicRecords.model';
import { GradeScaleModel } from 'src/modules/grades/grades.model';

// samples
import { sampleUsers } from './samples/usersSample';
import { sampleCourses } from './samples/coursesSample';
import { sampleSemesters } from './samples/semestersSample';
import { sampleOfferedCourses } from './samples/offeredCoursesSample';
import { sampleAcademicRecords } from './samples/academicRecordsSample';
import { sampleGrades } from './samples/grades';


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
    ) { }

    async seed() {
        // Clear existing data- children then parents
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
    }

}




