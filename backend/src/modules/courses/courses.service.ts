import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { v4 as uuidv4 } from 'uuid';
//models
import { CoursesModel } from './courses.model';
import { AcademicRecordsModel } from '../users/academicRecords.model';
import { SemestersModel } from './semesters.model';
import { UsersModel } from '../users/users.model';
import { OfferedCoursesModel } from './offeredCourses.model';

//interface
import { ServiceResult } from '../../common/interfaces/service-result.interface';
import { Courses, CurrenseSemesterCoursesInterface, OfferedCoursesInterface } from './interfaces/courses.interface';

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
    async getAllStudentCourses(id: string, semester?: string): Promise<ServiceResult<Courses[] | []>> {
        let customMessage: string;

        const courses = await this.academicRecordsModel.findAll({
            where: {
                studentId: id,
            },
            include: [
                {
                    model: CoursesModel,
                    as: "course",
                    attributes: ["code", "title", "credit"],
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
            attributes: ["grade"],
        });

        const formatted = courses.map((record) => ({
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
            data: formatted,
        }
    }

    // =========================================================================
    //? fetch the student's current semester courses 
    // =========================================================================
    async getStudentCurrentCourses(studentId: string): Promise<ServiceResult<CurrenseSemesterCoursesInterface[] | []>> {
        let customMessage: string;

        const today = new Date();

        const courses = await this.semestersModel.findAll({
            where: {
                startDate: { [Op.lte]: today },
                endDate: { [Op.gte]: today },
            },
            include: [{
                model: AcademicRecordsModel,
                as: "academicRecords",
                where: {
                    studentId: studentId,
                },
                include: [{
                    model: CoursesModel,
                    as: "course",

                    attributes: ["code", "title", "credit"]
                }],
                attributes: ["grade"]
            }],
            attributes: ["title", "startDate", "endDate",]
        });

        const formatted = courses.map(semester => {
            const { title, startDate, endDate, academicRecords } = semester.toJSON();

            return {
                semesterTitle: title,
                startDate: new Date(startDate),
                endDate,
                courses: academicRecords.map(record => ({
                    code: record.course?.code,
                    title: record.course?.title,
                    credit: record.course?.credit,
                    grade: record.grade,
                }))
            };
        });

        if (formatted.length === 0) {
            customMessage = "No courses found";
        } else {
            customMessage = "Courses found successfully";
        }

        // =====================================================
        return {
            message: customMessage,
            data: formatted,
        }
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
            currentSemesterCredit: student.currentSemesterCredit + course.credit,
            totalCredit: student.totalCredit + course.credit
        }, {
            where: { id: studentId }
        });

        return {
            message: "Student enrolled successfully",
            data: null,
        }
    }

    // =========================================================================
    //? fetch offered courses (available courses for registeration)
    // =========================================================================
    async getOfferedCourses(studentId: string): Promise<ServiceResult<OfferedCoursesInterface>> {

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
            attributes: ["currentSemesterCredit"]
        });
        if (!enrolledCredits) throw new NotFoundError("Student not found");

        // according to remaining credits view course, if no credit left view no courses
        const remainingCredits = currentSemester.maxCredits - enrolledCredits.currentSemesterCredit;


        console.log(`current semester max credit ${currentSemester.maxCredits} enrolled ${enrolledCredits.currentSemesterCredit} remaining ${remainingCredits}`)
        if (remainingCredits <= 0) return {
            message: "You have reached the maximum number of credits for this semester",
            data: { remainingCredits: 0, courses: [] },
        }

        // --------------------------------------------------------------------
        // get offered courses excluding already enrolled ones
        const offeredCourses = await this.offeredCoursesModel.findAll({
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


        const formatted = offeredCourses.map(record => ({
            id: record.course?.id,
            code: record.course?.code,
            title: record.course?.title,
            credit: record.course?.credit,
        }));

        return {
            message: formatted.length === 0 ? "No courses available" : "Courses fetched successfully",
            data: { remainingCredits, courses: formatted },
        }
    }

}

