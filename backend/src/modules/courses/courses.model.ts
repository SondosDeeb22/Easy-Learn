// ========================================================================
//? import
// ========================================================================

import { Table, Column, Model, DataType, PrimaryKey, HasMany } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

// models
import { AcademicRecordsModel } from "../users/academicRecords.model";
import { OfferedCoursesModel } from "./offeredCourses.model";

import { CourseInterface } from "./interfaces/courses.interface";

// ========================================================================
@Table({ tableName: "courses" })
export class CoursesModel extends Model<CoursesModel> implements CourseInterface {

    // Id =============================
    @PrimaryKey
    @Column(DataType.STRING(8))
    @ApiProperty()
    declare id: string;

    // code =============================
    @Column(DataType.STRING(50))
    @ApiProperty()
    declare code: string;

    // title =============================
    @Column(DataType.STRING(250))
    @ApiProperty()
    declare title: string;

    // credit =============================
    @Column(DataType.INTEGER)
    @ApiProperty()
    declare credit: number;

    // Associations --------------------------------------
    @HasMany(() => AcademicRecordsModel)
    declare academicRecords: AcademicRecordsModel[];

    @HasMany(() => OfferedCoursesModel)
    declare offeredCourses: OfferedCoursesModel[];
}
