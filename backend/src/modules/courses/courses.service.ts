import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';


//models
import { CoursesModel } from './courses.model';
import { AcademicRecordsModel } from '../users/academicRecords.model';
import { SemestersModel } from './semesters.model';
//interface
import { ServiceResult } from '../../common/interfaces/service-result.interface';
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


    //? get All Courses offered in the university
    // =========================================================================
    // async getAllCourses(id: string): Promise<ServiceResult<{ code: string, title: string }[] | []>> {

    async getAllCourses(id: string, semester?: string) {
        let customMessage: string;

        const courses = await this.academicRecordsModel.findAll({
            where: {
                studentId: id,
            },
            include: [
                {
                    model: CoursesModel,
                    as: "course",
                    attributes: ["code", "title"],
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
}
