import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';


import { SemestersModel } from '../../semesters/semesters.model';
import { AcademicRecordsModel } from '../../academicRecords/academic-records.model';
import { CoursesModel } from '../courses.model';

import { ServiceResult } from '../../../common/interfaces/service-result.interface';
import { CurrentStudentCourses } from '../interfaces/courses.interface';

// =====================================================================================
@Injectable()
export class GetCurrentStudentCoursesService {
    constructor(
        @InjectModel(SemestersModel)
        private readonly semestersModel: typeof SemestersModel,
    ) { }

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
}
