import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { format } from 'sql-formatter'

import { WhereOptions } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
//models
import { CoursesModel } from '../courses/courses.model';
import { AcademicRecordsModel } from '../academicRecords/academic-records.model';
import { SemestersModel } from '../semesters/semesters.model';
import { UsersModel } from '../users/users.model';
import { OfferedCoursesModel } from './offered-courses.model';

//interface
import { ServiceResult } from '../../common/interfaces/service-result.interface';
import { Course, OfferedCourses, AvailableCourses, AdminOfferedCourses } from './interfaces/offeredCourses.interface';

//error
import { NotFoundError } from "../../common/errors";

// dtos
import { CreateOfferedCourseDto } from './dtos/offered-courses.dto';

// helper
import { CrudHelper } from '../../common/helpers/crud.helper';


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

        private readonly crudHelper: CrudHelper
    ) { }


    // =========================================================================
    //? fetch offered courses (available courses for registeration) according to the student remaining credits 
    // =========================================================================
    async getOfferedCoursesForStudent(studentId: string, page: number, limit: number): Promise<ServiceResult<OfferedCourses>> {

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
        console.log("backend/courses.service (getOfferedCoursesForStudent function ) - offered courses count= \n", offeredCourses.count,
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

    // =========================================================================
    //? fetch offered courses for admin management (filterable by semester)
    // =========================================================================
    async getOfferedCoursesForAdmin(semesterId: string | undefined, page: number, limit: number): Promise<ServiceResult<AdminOfferedCourses>> {
        const offset = (page - 1) * limit;

        const whereClause: WhereOptions<OfferedCoursesModel> = {};
        if (semesterId) whereClause.semesterId = semesterId;

        const result = await this.offeredCoursesModel.findAndCountAll({
            limit,
            offset,
            where: whereClause,
            include: [
                {
                    model: CoursesModel,
                    as: 'course',
                    attributes: ['id', 'code', 'title', 'credit'],
                },
                {
                    model: SemestersModel,
                    as: 'semester',
                    attributes: ['id', 'title'],
                },
            ],
        });

        const formatted = result.rows.map(row => ({
            id: row.id,
            courseId: row.courseId,
            semesterId: row.semesterId,
            course: row.course ? { id: row.course.id, code: row.course.code, title: row.course.title, credit: row.course.credit } : null,
            semester: row.semester ? { id: row.semester.id, title: row.semester.title } : null,
        }));

        return {
            message: `${result.count} offered course(s) found`,
            data: { courses: formatted, totalRows: result.count },
        };
    }

    // =========================================================================
    //? get courses NOT yet offered in a given semester (admin — for Add Offered Course dropdown)
    // =========================================================================
    async getAvailableCoursesForSemester(semesterId: string, page: number, limit: number): Promise<ServiceResult<AvailableCourses>> {
        const offset = (page - 1) * limit;

        const result = await this.coursesModel.findAndCountAll({
            subQuery: false,// prevent nested query
            limit,
            offset,
            where: {
                '$offeredCourses.id$': null,  // get only courses with no matching offered-course (in left-join, null is placed on offered courses for courses with no match)
            },
            include: [
                {
                    model: OfferedCoursesModel,
                    as: 'offeredCourses',
                    required: false,  // LEFT JOIN will keep courses that have no match
                    where: { semesterId },
                    attributes: [],
                },
            ],
            attributes: ['id', 'code', 'title', 'credit'],


            logging: (sql) => {
                const cleanSql = sql.replace(/^Executing\s+\(default\):\s*/, '');

                console.log(`\n================ SQL =================\n${format(cleanSql, { language: 'postgresql' })}\n========================================\n`);
            },

        });

        const formatted = result.rows.map(row => ({
            id: row.id,
            code: row.code,
            title: row.title,
            credit: row.credit,
        }));

        return {
            message: `${result.count} offered course(s) found`,
            data: { courses: formatted, totalRows: result.count },
        };
    }




    // =========================================================================
    //? add a course to a semester (admin)
    // =========================================================================
    async createOfferedCourse(data: CreateOfferedCourseDto): Promise<ServiceResult<null>> {
        const { courseId, semesterId } = data;

        // validate course exists
        const course = await this.coursesModel.findByPk(courseId);
        if (!course) throw new NotFoundError(`Course with id ${courseId} not found`);

        // validate semester exists
        const semester = await this.semestersModel.findByPk(semesterId);
        if (!semester) throw new NotFoundError(`Semester with id ${semesterId} not found`);


        // check for duplicate (same course in same semester)
        const existing = await this.offeredCoursesModel.findOne({ where: { courseId, semesterId } });
        if (existing) throw new ConflictException(`DUPLICATE_FIELD:course — this course is already offered in the selected semester`);

        await this.crudHelper.add(this.offeredCoursesModel, {
            id: uuidv4().substring(0, 8),
            courseId,
            semesterId
        },)
        return {
            message: 'Course added to semester successfully',
            data: null,
        };
    }



    // =========================================================================
    //? delete an offered course by id (admin)
    // =========================================================================
    async deleteOfferedCourse(id: string): Promise<ServiceResult<null>> {
        const record = await this.offeredCoursesModel.findByPk(id);
        if (!record) throw new NotFoundError(`Offered course with id ${id} not found`);

        await this.offeredCoursesModel.destroy({ where: { id } });

        return {
            message: 'Offered course removed successfully',
            data: null,
        };
    }

}
