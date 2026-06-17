import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

//models
import { CoursesModel } from './courses.model';
import { AcademicRecordsModel } from '../users/academicRecords.model';
import { SemestersModel } from './semesters.model';
//interface
import { ServiceResult } from '../../common/interfaces/service-result.interface';
import { Courses, CurrenseSemesterCoursesInterface } from './interfaces/courses.interface';
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
    async getCurrentSemesterCourses(studentId: string): Promise<ServiceResult<CurrenseSemesterCoursesInterface[] | []>> {
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
}
