import { CoursesModel } from "../../courses/courses.model";
import { AcademicRecordsModel } from "../academic-records.model";

//dto
import { UpdateGradeDto } from "../dtos/academicRecords.dto";

//helper
import { CrudHelper } from "src/common/helpers/crud.helper";

//errors
import { ConflictError, NotFoundError, ValidationError, InternalServerError, UnauthorizedError } from "src/common/errors";


// type
type UpdateGradeData = {
    id: string;
    numericGrade: number;
    letterGrade: string;
};
//===================================================================================================
//? function to Update Student Grade
//===================================================================================================
const crudHelper = new CrudHelper();

export async function updateStudentGrade(
    academicRecordsModel: typeof AcademicRecordsModel,
    payload: UpdateGradeData
): Promise<{ updated: boolean, updatedRecord: AcademicRecordsModel[], messageKey: string }> {
    try {
        const result = await crudHelper.update(academicRecordsModel, payload, {});

        return {
            updated: result.updated,
            updatedRecord: (result.updatedRows as AcademicRecordsModel[]) ?? [],
            messageKey: result.updated ? 'common.crud.updated' : 'common.crud.noChanges'
        };

    } catch (error) {
        if (
            error instanceof ValidationError ||
            error instanceof NotFoundError ||
            error instanceof InternalServerError ||
            error instanceof UnauthorizedError
        ) {
            throw error;
        }

        throw new InternalServerError("common.errors.internal");
    }
}

