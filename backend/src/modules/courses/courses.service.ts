import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, where } from 'sequelize';
import { WhereOptions } from "sequelize";

import { v4 as uuidv4 } from 'uuid';
//models
import { CoursesModel } from './courses.model';
import { AcademicRecordsModel } from '../academicRecords/academic-records.model';
import { SemestersModel } from '../semesters/semesters.model';
import { UsersModel } from '../users/users.model';
import { OfferedCoursesModel } from '../offered-courses/offered-courses.model';

//interface
import { ServiceResult } from '../../common/interfaces/service-result.interface';
import { AllStudentCourses, CurrentStudentCourses, Course, CoursesQueryParams, AllCourses } from './interfaces/courses.interface';

//error
import { NotFoundError } from "../../common/errors";

// dtos
import { GetCoursesQueryDto, CreateCourseDto, UpdateCourseDto } from './dtos/courses.dto';


// enums
import { Roles } from "../users/enums/users.enum";

// helper
import { CrudHelper } from "../../common/helpers/crud.helper";

// services
import { CourseEnrollmentService } from './services/CourseEnrollment.service';
import { GetCurrentStudentCoursesService } from './services/GetCurrentStudentCourses.service';
// =========================================================================
@Injectable()
export class CoursesService {

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


        private readonly crudHelper: CrudHelper,
        private readonly courseEnrollment: CourseEnrollmentService,
        private readonly getCurrentStudentCoursesService: GetCurrentStudentCoursesService,
    ) { }

    // =========================================================================
    //? create a new course
    // =========================================================================

    async createCourse(data: CreateCourseDto): Promise<ServiceResult<null>> {
        const { code, title, credit, active } = data;
        console.log('CreateCourse payload:', { code, title, credit, active });

        if (credit < 1 || credit > 10) {
            throw new BadRequestException(
                "Course credit must be between 1 and 10"
            );
        }
        await this.crudHelper.add(this.coursesModel, {
            id: uuidv4().substring(0, 8),
            code,
            title,
            credit,
            active: active ?? true,
        }, {
            nonDuplicateFields: ["code", "title"],
        })


        return {
            message: "Course created successfully",
            data: null,
        }

    }

    // =========================================================================
    //? update course details
    // =========================================================================

    async updateCourse(payload: UpdateCourseDto): Promise<ServiceResult<boolean>> {
        const { id, code, title, credit, active } = payload;
        console.log('UpdateCourse payload:', { id, code, title, credit, active });

        if (credit < 1 || credit > 10) {
            throw new BadRequestException(
                "Course credit must be between 1 and 10"
            );
        }

        const result = await this.crudHelper.update(this.coursesModel, {
            id,
            code,
            title,
            credit,
            active,
        }, {
            nonDuplicateFields: ["code", "title"],
        });

        return {
            message: result.updated ? "Course updated successfully" : "No changes were made",
            data: result.updated,
        };
    }



    // =========================================================================
    //? get courses with optional filters (code, name, status)
    // =========================================================================

    async getCourses(query: GetCoursesQueryDto, page: number, limit: number): Promise<ServiceResult<AllCourses>> {
        const { code, title, status } = query;

        let whereClause: WhereOptions<CoursesModel> = {};

        if (code) {
            //apply case-insensitive (iLike) partial match to find Course code that matches the provided code
            whereClause.code = { [Op.iLike]: `%${code}%` };

        }

        if (title) {
            whereClause.title = { [Op.iLike]: `%${title}%` };
        }

        if (status !== undefined) {
            whereClause.active = status === 'true';
        }


        const offset = (page - 1) * limit;
        const result = await this.coursesModel.findAndCountAll({
            limit,
            offset,
            where: whereClause,
            logging: console.log,
        });

        console.log(`[backend/courses.service] - getCourses()\n 
            filters: ${JSON.stringify(whereClause)}\n 
            page: ${page}, limit: ${limit}\n 
            total rows: ${result.count}`);

        if (!result || result.count === 0) {
            return { message: "No courses found", data: { courses: [], totalRows: 0 } };
        }

        const formatted = result.rows.map((course) => ({
            id: course.id,
            code: course.code,
            title: course.title,
            credit: course.credit,
            active: course.active,
        }));

        return {
            message: `${formatted.length} Courses fetched successfully`,
            data: { courses: formatted, totalRows: result.count },
        };
    }

    // =========================================================================
    //? get all courses studnet is associated with
    // =========================================================================
    async getAllStudentCourses(id: string, page: number, limit: number, semester?: string): Promise<ServiceResult<AllStudentCourses>> {
        let customMessage: string;

        const offset = (page - 1) * limit;
        const allStudentCourses = await this.academicRecordsModel.findAndCountAll({
            offset,
            limit,
            where: {
                studentId: id,
            },
            include: [
                {
                    model: CoursesModel,
                    as: "course",
                    attributes: ["id", "code", "title", "credit"],
                },
                {
                    // filtering with semester model only occur when semesterId is provided as provided
                    model: SemestersModel,
                    as: "semester",
                    attributes: ["title"],
                    ...(semester && {
                        where: {
                            id: semester,
                        },
                    }),
                    required: !!semester,
                },
            ],
            attributes: ["id", "numericGrade", "letterGrade"],
        });

        const formatted = allStudentCourses.rows.map((record) => ({
            id: record.id,
            code: record.course?.code,
            title: record.course?.title,
            credit: record.course?.credit,
            numericGrade: record.numericGrade,
            letterGrade: record.letterGrade,
            active: record.course?.active,
        }));

        if (formatted.length === 0) {
            customMessage = "No courses found";
        } else {
            customMessage = "Courses found successfully";
        }

        // =====================================================
        return {
            message: customMessage,
            data: { courses: formatted, totalRows: allStudentCourses.count },
        }
    }

    // =========================================================================
    //? fetch the student's current semester courses 
    // =========================================================================
    async getCurrentStudentCourses(
        studentId: string,
    ): Promise<ServiceResult<CurrentStudentCourses>> {
        return this.getCurrentStudentCoursesService.getCurrentStudentCourses(studentId);
    }

    // =========================================================================
    //? enroll student in a course
    // =========================================================================
    async enrollStudent(studentId: string, courseId: string): Promise<ServiceResult<null>> {
        return this.courseEnrollment.enrollStudent(studentId, courseId);
    }



    // =========================================================================
    //? withdraw student from a course
    // =========================================================================

    async withdrawStudentCourse(studentId: string, courseId: string): Promise<ServiceResult<null>> {

        // verify student exists
        const student = await this.usersModel.findByPk(studentId);
        if (!student) throw new NotFoundError("Student not found");

        // verify course exists
        const course = await this.coursesModel.findByPk(courseId);
        if (!course) throw new NotFoundError("Course not found");

        // remove the academic record
        await this.crudHelper.remove(this.academicRecordsModel, {
            studentId: studentId,
            courseId: courseId
        });

        // deduct course credits from student's totals
        await this.crudHelper.update(this.usersModel, {
            id: studentId,
            currentSemesterCredits: Math.max(0, (student.currentSemesterCredits ?? 0) - course.credit),
            totalCredits: Math.max(0, (student.totalCredits ?? 0) - course.credit)
        })

        return {
            message: "Student withdrawn successfully",
            data: null,
        }

    }
}