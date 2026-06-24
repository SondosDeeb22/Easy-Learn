// ========================================================================
//? import
// ========================================================================
import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";

// models
import { AcademicRecordsModel } from "../academicRecords/academic-records.model";

//interfaces
import { Grade } from "./interfaces/grades.interface";
// ========================================================================
@Table({ tableName: "grade_scale" })
export class GradeScaleModel extends Model<GradeScaleModel> implements Grade {
    // id =============================================
    @PrimaryKey
    @Column(DataType.STRING(2))
    declare letterGrade: string;

    // gradePoint =============================================
    @Column(DataType.DOUBLE(2, 1))
    declare gradePoint: number;

    // max Score =============================================
    @Column(DataType.INTEGER())
    declare maxScore: number;

    // min Score =============================================
    @Column(DataType.INTEGER())
    declare minScore: number;


    // relations ------------------------------------------
    @HasMany(() => AcademicRecordsModel)
    declare academicRecords: AcademicRecordsModel[];
}
