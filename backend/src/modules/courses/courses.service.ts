import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { v4 as uuidv4 } from 'uuid';
//models
import { CoursesModel } from './courses.model';
import { AcademicRecordsModel } from '../academicRecords/academic-records.model';
import { SemestersModel } from '../semesters/semesters.model';
import { UsersModel } from '../users/users.model';
import { OfferedCoursesModel } from '../offered-courses/offered-courses.model';

//interface
import { ServiceResult } from '../../common/interfaces/service-result.interface';
import { AllStudentCourses, CurrentStudentCourses, Course } from './interfaces/courses.interface';

//error
import { NotFoundError } from "../../common/errors";


// enums
import { Roles } from "../users/enums/roles.enum";

// helper
import { CrudHelper } from "../../common/helpers/crud.helper";
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
    ) { }

    // =========================================================================
    //? get all courses from courses table
    // =========================================================================

    async getAllCourses(): Promise<ServiceResult<Course[] | []>> {

        const result = await this.coursesModel.findAll();
        if (!result) return { message: "No courses found", data: [] };

        const formatted = result.map((course) => ({
            id: course.id,
            code: course.code,
            title: course.title,
            credit: course.credit,
        }));
        return {
            message: `${formatted.length} Courses fetched successfully`,
            data: formatted,
        }


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
        let customMessage: string;
        const today = new Date();


        // Find the current active semester(s) and include academic records for the student
        const result = await this.semestersModel.findAndCountAll({
            where: {
                startDate: { [Op.lte]: today },
                endDate: { [Op.gte]: today },
            },
            include: [{
                model: AcademicRecordsModel,
                as: "academicRecords",
                where: { studentId },
                include: [{
                    model: CoursesModel,
                    as: "course",
                    attributes: ["id", "code", "title", "credit"]
                }],
                attributes: ["id", "numericGrade", "letterGrade"]
            }],
            attributes: ["title", "id", "startDate", "endDate"]
        });

        if (result.count === 0) {
            customMessage = "No courses found";

            const emptyData = {
                semesterTitle: "",
                semesterId: "",
                startDate: new Date(),
                endDate: new Date(),
                totalRows: 0,
                courses: [],
            };
            return { message: customMessage, data: emptyData };
        }

        const semester = result.rows[0];
        const { title, id, startDate, endDate, academicRecords } = (semester as any).toJSON();

        const courses = academicRecords.map((record: any) => ({
            academicRecordId: record.id,
            id: record.course?.id,
            code: record.course?.code,
            title: record.course?.title,
            credit: record.course?.credit,
            numericGrade: record.numericGrade,
            letterGrade: record.letterGrade,
        }));
        console.log("--------------------\n ", courses[0].academicRecordId)
        console.log(`Student Current Courses:\n${JSON.stringify(courses, null, 9)}`);

        const data = {
            semesterId: id,
            semesterTitle: title,
            startDate: new Date(startDate),
            endDate,
            totalRows: result.count,
            courses,
        };

        customMessage = data.courses.length === 0 ? "No courses found" : "Courses found successfully";
        console.log(`/courses.service.ts - (getCurrentStudentCourses):\nsemester= ${JSON.stringify(semester?.toJSON(), null, 2)} \ndata= ${JSON.stringify(data, null, 2)}`);
        return { message: customMessage, data };
    }

    // =========================================================================
    //? enroll student in a course
    // =========================================================================
    async enrollStudent(studentId: string, courseId: string): Promise<ServiceResult<null>> {

        // verify student exists
        const student = await this.usersModel.findByPk(studentId);
        if (!student) throw new NotFoundError("Student not found");

        // if user is not student we stop the enrollment process --------
        if (student.role !== Roles.STUDENT) {
            throw new ConflictException(
                "Only students can enroll in courses"
            );
        }

        // verify course exists
        const course = await this.coursesModel.findByPk(courseId);
        if (!course) throw new NotFoundError("Course not found");



        // check if student is already enrolled
        const alreadyEnrolled = await this.academicRecordsModel.findOne({
            where: { studentId, courseId }
        });
        if (alreadyEnrolled) throw new ConflictException("Already enrolled in this course");

        // get current semesterv
        const today = new Date();
        const currentSemester = await this.semestersModel.findOne({
            where: {
                startDate: { [Op.lte]: today },
                endDate: { [Op.gte]: today },
            }
        });
        if (!currentSemester) throw new NotFoundError("No active semester found");
        // verify course is offered in the current semester
        const isOffered = await this.offeredCoursesModel.findOne({
            where: { courseId, semesterId: currentSemester.id }
        });
        if (!isOffered) {
            throw new ConflictException("This course is not offered in the current semester");
        }

        // enroll student - add reocrd in academic records table  ----------------------------------------------
        await this.academicRecordsModel.create({
            id: uuidv4(),
            studentId,
            courseId,
            semesterId: currentSemester.id,
            numericGrade: null,
            letterGrade: null
        });


        // update student's credit
        await this.usersModel.update({
            currentSemesterCredits: (student.currentSemesterCredits ?? 0) + course.credit,
            totalCredits: (student.totalCredits ?? 0) + course.credit
        }, {
            where: { id: studentId }
        });

        return {
            message: "Student enrolled successfully",
            data: null,
        }
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
        await this.usersModel.update({
            currentSemesterCredits: Math.max(0, (student.currentSemesterCredits ?? 0) - course.credit),
            totalCredits: Math.max(0, (student.totalCredits ?? 0) - course.credit)
        }, {
            where: { id: studentId }
        });

        return {
            message: "Student withdrawn successfully",
            data: null,
        }

    }
}