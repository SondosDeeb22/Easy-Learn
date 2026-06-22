import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { v4 as uuidv4 } from 'uuid';
//models
import { CoursesModel } from './courses.model';
import { AcademicRecordsModel } from '../academicRecords/academicRecords.model';
import { SemestersModel } from './semesters.model';
import { UsersModel } from '../users/users.model';
import { OfferedCoursesModel } from './offeredCourses.model';

//interface
import { ServiceResult } from '../../common/interfaces/service-result.interface';
import { OfferedCoursesInterface, AllStudentCourses, CurrentStudentCourses, Course, Semester } from './interfaces/courses.interface';

//error
import { NotFoundError } from "../../common/errors";

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
    ) { }


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
            attributes: ["id", "grade"],
        });

        const formatted = allStudentCourses.rows.map((record) => ({
            id: record.id,
            code: record.course?.code,
            title: record.course?.title,
            credit: record.course?.credit,
            grade: record.grade,
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
        page: number = 1,
        limit: number = 10,
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
                attributes: ["id", "grade"]
            }],
            attributes: ["title", "startDate", "endDate"]
        });

        if (result.count === 0) {
            customMessage = "No courses found";

            const emptyData = {
                semesterTitle: "",
                startDate: new Date(),
                endDate: new Date(),
                totalRows: 0,
                courses: [],
            };
            return { message: customMessage, data: emptyData };
        }

        const semester = result.rows[0];
        const { title, startDate, endDate, academicRecords } = (semester as any).toJSON();

        const courses = academicRecords.map((record: any) => ({
            academicRecordId: record.id,
            id: record.course?.id,
            code: record.course?.code,
            title: record.course?.title,
            credit: record.course?.credit,
            grade: record.grade,
        }));
        console.log("--------------------\n ", courses[0].academicRecordId)
        console.log(`Student Current Courses:\n${JSON.stringify(courses, null, 9)}`);

        const data = {
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

        // verify course exists
        const course = await this.coursesModel.findByPk(courseId);
        if (!course) throw new NotFoundError("Course not found");

        // check if student is already enrolled
        const alreadyEnrolled = await this.academicRecordsModel.findOne({
            where: { studentId, courseId }
        });
        if (alreadyEnrolled) throw new ConflictException("Already enrolled in this course");

        // get current semester
        const today = new Date();
        const currentSemester = await this.semestersModel.findOne({
            where: {
                startDate: { [Op.lte]: today },
                endDate: { [Op.gte]: today },
            }
        });
        if (!currentSemester) throw new NotFoundError("No active semester found");


        // enroll studen ----------------------------------------------t
        await this.academicRecordsModel.create({
            id: uuidv4(),
            studentId,
            courseId,
            semesterId: currentSemester.id,
            grade: null
        });

        // update student's credit
        await this.usersModel.update({
            currentSemesterCredits: student.currentSemesterCredits + course.credit,
            totalCredits: student.totalCredits + course.credit
        }, {
            where: { id: studentId }
        });

        return {
            message: "Student enrolled successfully",
            data: null,
        }
    }

    // =========================================================================
    //? fetch offered courses (available courses for registeration) that studetn can pick from according to his credits 
    // =========================================================================
    async getAvailableCoursesForStudent(studentId: string, page: number, limit: number): Promise<ServiceResult<OfferedCoursesInterface>> {

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
        const remainingCredits = currentSemester.maxCredits - enrolledCredits.currentSemesterCredits;


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

    // =========================================================================
    // =========================================================================


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
    //? get all semesters
    // =========================================================================

    async getAllSemesters(): Promise<ServiceResult<Semester[] | []>> {

        const result = await this.semestersModel.findAll();
        if (!result) return { message: "No Semesters found", data: [] };

        const formatted = result.map((semester) => ({
            id: semester.id,
            title: semester.title,
        }));
        return {
            message: `${formatted.length} Semesters fetched successfully`,
            data: formatted,
        }


    }

}

