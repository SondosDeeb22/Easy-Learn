// =============================================================
//? Importing
// =============================================================
import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript";

import { UsersModel } from "../users/users.model";
import { CoursesModel } from "../courses/courses.model";
import { SemestersModel } from "../semesters/semesters.model";

import { AcademicRecordInterface } from "./interfaces/academicRecord.interface";
import { GradeScaleModel } from "../grades/grades.model";

// =============================================================
@Table({ tableName: "academic_records", paranoid: true })
export class AcademicRecordsModel extends Model<AcademicRecordsModel, AcademicRecordInterface> implements AcademicRecordInterface {

    // id =============================================
    @PrimaryKey
    @Column(DataType.STRING(255))

    declare id: string;

    // studentId =============================================
    @ForeignKey(() => UsersModel)
    @Column(DataType.STRING(8))

    declare studentId: string;

    // courseId =============================================
    @ForeignKey(() => CoursesModel)
    @Column(DataType.STRING(8))

    declare courseId: string;


    // semesterId =============================================
    @ForeignKey(() => SemestersModel)
    @Column(DataType.STRING(8))

    declare semesterId: string;


    // letterGrade =============================================
    @AllowNull(true)
    @ForeignKey(() => GradeScaleModel)
    @Column(DataType.STRING(2))
    declare letterGrade: string | null;

    // numericGrade =============================================
    @AllowNull(true)
    @Column(DataType.DOUBLE(5, 2))

    declare numericGrade: number;


    // relation ----------------------------
    @BelongsTo(() => SemestersModel)
    declare semester: SemestersModel;

    @BelongsTo(() => CoursesModel)
    declare course: CoursesModel;

    @BelongsTo(() => UsersModel)
    declare user: UsersModel;

    @BelongsTo(() => GradeScaleModel)
    declare gradeScale: GradeScaleModel;

}

