// =============================================================
//? Importing
// =============================================================
import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
// import { ApiProperty } from "@nestjs/swagger";

import { UsersModel } from "./users.model";
import { CoursesModel } from "../courses/courses.model";
import { SemestersModel } from "../courses/semesters.model";

import { AcademicRecordInterface } from "./interfaces/academicRecord.interface";

// =============================================================
@Table({ tableName: "academic_records" })
export class AcademicRecordsModel extends Model<AcademicRecordsModel> implements AcademicRecordInterface {

    // id =============================================
    @PrimaryKey
    @Column(DataType.STRING(8))
    // @ApiProperty()
    declare id: string;

    // studentId =============================================
    @ForeignKey(() => UsersModel)
    @Column(DataType.STRING(8))
    // @ApiProperty()
    declare studentId: string;

    // courseId =============================================
    @ForeignKey(() => CoursesModel)
    @Column(DataType.STRING(8))
    // @ApiProperty()
    declare courseId: string;


    // semesterId =============================================
    @ForeignKey(() => SemestersModel)
    @Column(DataType.STRING(8))
    // @ApiProperty()
    declare semesterId: string;


    // grade =============================================
    @Column(DataType.STRING)
    // @ApiProperty()
    declare grade: string;


    // relation ----------------------------
    @BelongsTo(() => SemestersModel)
    declare semester: SemestersModel;

    @BelongsTo(() => CoursesModel)
    declare course: CoursesModel;

    @BelongsTo(() => UsersModel)
    declare student: UsersModel;

}

