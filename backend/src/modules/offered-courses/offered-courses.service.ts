import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { v4 as uuidv4 } from 'uuid';
//models
import { CoursesModel } from '../courses/courses.model';
import { AcademicRecordsModel } from '../academicRecords/academicRecords.model';
import { SemestersModel } from '../semesters/semesters.model';
import { UsersModel } from '../users/users.model';
import { OfferedCoursesModel } from './offered-courses.model';

//interface
import { ServiceResult } from '../../common/interfaces/service-result.interface';
import { OfferedCourses } from './interfaces/offeredCourses.interface';

//error
import { NotFoundError } from "../../common/errors";


// =========================================================================

@Injectable()
export class OfferedCoursesService {

    constructor(
        @InjectModel(CoursesModel)
        private readonly coursesModel: typeof CoursesModel,
        @InjectModel(AcademicRecordsModel)
        private readonly academicRecordsModel: typeof AcademicRecordsModel,
        @InjectModel(SemestersModel)
        private readonly semestersModel: typeof SemestersModel,
        @InjectModel(UsersModel)
        private readonly usersModel: typeof UsersModel,
        @InjectModel(OfferedCoursesModel)
        private readonly offeredCoursesModel: typeof OfferedCoursesModel,
    ) { }


    // =========================================================================
    //? fetch offered courses (available courses for registeration) that studetn can pick from according to his credits 
    // =========================================================================
    async getAvailableCoursesForStudent(studentId: string, page: number, limit: number): Promise<ServiceResult<OfferedCourses>> {

        // get current semester
        const today = new Date();
        const currentSemester = await this.semestersModel.findOne({
            where: {
                startDate: { [Op.lte]: today },
                endDate: { [Op.gte]: today },
            }
        });
        if (!currentSemester) throw new NotFoundError("No active semester found");
        // -----------------------------------------------------------------------------------

        // get courses that student is already enrolled in this semester
        const enrolledCourses = await this.academicRecordsModel.findAll({
            where: { studentId },
            attributes: ["courseId"]
        });
        const enrolledCourseIds = enrolledCourses.map(record => record.courseId);

        // -----------------------------------------------------------------------------------

        // calculate how many credit student can enroll in this semester 
        const enrolledCredits = await this.usersModel.findByPk(studentId, {
            attributes: ["currentSemesterCredits"]
        });
        if (!enrolledCredits) throw new NotFoundError("Student not found");

        // according to remaining credits view course, if no credit left view no courses
        const remainingCredits = currentSemester.maxCredits - (enrolledCredits.currentSemesterCredits ?? 0);


        console.log(`current semester max credit ${currentSemester.maxCredits} enrolled ${enrolledCredits.currentSemesterCredits} remaining ${remainingCredits}`)
        if (remainingCredits <= 0) return {
            message: "You have reached the maximum number of credits for this semester",
            data: { remainingCredits: 0, courses: [], totalRows: 0 },
        }

        // --------------------------------------------------------------------
        const offset = (page - 1) * limit;
        const offeredCourses = await this.offeredCoursesModel.findAndCountAll({
            limit,
            offset,
            where: {
                semesterId: currentSemester.id,
                courseId: { [Op.notIn]: enrolledCourseIds.length ? enrolledCourseIds : [''] }
            },
            include: [{
                model: CoursesModel,
                as: "course",
                where: {
                    credit: { [Op.lte]: remainingCredits },
                },
                attributes: ["code", "title", "credit", "id"]
            }],
            attributes: []
        });
        console.log("backend/courses.service (getAvailableCoursesForStudent function ) - offered courses count= \n", offeredCourses.count,
            "\noffered courses = \n", offeredCourses.rows.map(record => (record.course?.toJSON())));


        const formatted = offeredCourses.rows.map(record => ({
            id: record.course?.id,
            code: record.course?.code,
            title: record.course?.title,
            credit: record.course?.credit,
        }));


        return {
            message: formatted.length === 0 ? "No courses available" : "Courses fetched successfully",
            data: { remainingCredits, courses: formatted, totalRows: offeredCourses.count },
        }
    }

}
