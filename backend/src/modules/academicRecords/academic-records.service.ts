import { Injectable } from "@nestjs/common";

import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
//dtos
import { UpdateGradeDto } from './dtos/academicRecords.dto';
// models
import { AcademicRecordsModel } from "./academic-records.model";
import { CoursesModel } from "../courses/courses.model";
import { GradeScaleModel } from "../grades/grades.model";
// helper
import { updateStudentGrade } from "./services/crudCourses.service";

//interface
import { ServiceResult } from "src/common/interfaces/service-result.interface";

//error
import { NotFoundError } from "src/common/errors";

import { GradeProducer } from "../background-jobs/producers/grade.producer";
// ==================================================================================
@Injectable()
export class AcademicRecordsService {
    constructor(
        @InjectModel(CoursesModel)
        private readonly coursesModel: typeof CoursesModel,

        @InjectModel(AcademicRecordsModel)
        private readonly academicRecordsModel: typeof AcademicRecordsModel,

        @InjectModel(GradeScaleModel)
        private readonly gradeScaleModel: typeof GradeScaleModel,

        private readonly gradeProducer: GradeProducer,

    ) { }

    // ===================================================================================================
    //? function to UPDATE data
    // =====================================================================================================
    async updateStudentGrade(payload: UpdateGradeDto): Promise<ServiceResult<boolean>> {

        console.log(`This Numerical Grade: ${payload.numericGrade}`)
        // convert the student grade into the letterGrade
        const matchingLetterGrade = await this.gradeScaleModel.findOne({
            where: [{
                minScore: {
                    [Op.lte]: payload.numericGrade,
                },
                maxScore: {
                    [Op.gte]: payload.numericGrade,
                }
            }],
            attributes: ["letterGrade"]
        });

        if (!matchingLetterGrade) throw new NotFoundError(`There is no matching letter grade for this grade ${payload.numericGrade}, try something else`);

        const letterGrade = matchingLetterGrade.letterGrade;

        console.log(`equals this Letter grade: ${letterGrade}`)


        // ------------------------------------------------------------------------------
        const result = await updateStudentGrade(this.academicRecordsModel, {
            id: payload.id,
            numericGrade: payload.numericGrade,
            letterGrade,
        })

        const record = Array.isArray(result.updatedRecord)
            ? result.updatedRecord[0]
            : result.updatedRecord;
        if (result.updated && record?.studentId && record?.semesterId) {
            // pass the remaining work(calculating and updating GPA and CGPA) to the background worker
            await this.gradeProducer.updateGPAAndCGPAJob({
                studentId: record.studentId,
                semesterId: record.semesterId
            })


        }

        console.log(`[/academic-records.service.ts]\nUpdated Record: ${JSON.stringify(result, null, 2)},\nType of: ${typeof result.updatedRecord}`)



        return {
            data: result.updated,
            message: result.messageKey,
        }
    }
}

