import { Injectable } from "@nestjs/common";

import { InjectModel } from "@nestjs/sequelize";

//dtos
import { UpdateGradeDto } from './dtos/academicRecords.dto';
// models
import { AcademicRecordsModel } from "./academicRecords.model";
import { CoursesModel } from "../courses/courses.model";

// helper
import { updateStudentGrade } from "./services/crudCourses.service";

//interface
import { ServiceResult } from "src/common/interfaces/service-result.interface";

@Injectable()
export class AcademicRecordsService {
    constructor(
        @InjectModel(CoursesModel)
        private readonly coursesModel: typeof CoursesModel,

        @InjectModel(AcademicRecordsModel)
        private readonly academicRecordsModel: typeof AcademicRecordsModel,

    ) { }

    // ===================================================================================================
    //? function to UPDATE data
    // =====================================================================================================
    async updateStudentGrade(payload: UpdateGradeDto): Promise<ServiceResult<boolean>> {

        const result = await updateStudentGrade(this.academicRecordsModel, payload)

        return {
            data: result.updated,
            message: result.messageKey,
        }
    }
}