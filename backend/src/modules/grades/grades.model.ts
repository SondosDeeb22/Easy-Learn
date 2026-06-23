// ========================================================================
//? import
// ========================================================================
import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";

// models
import { AcademicRecordsModel } from "../academicRecords/academicRecords.model";

//interfaces
import { Grade } from "./interfaces/grades.interface";
// ========================================================================
@Table({ tableName: "grade_scale" })
export class GradeScaleModel extends Model<GradeScaleModel> implements Grade {
    // id =============================================
    @PrimaryKey
    @Column(DataType.STRING(2))
    declare letterGrade: string;

    // coefficient =============================================
    @Column(DataType.DECIMAL(2, 1))
    declare coefficient: number;

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
