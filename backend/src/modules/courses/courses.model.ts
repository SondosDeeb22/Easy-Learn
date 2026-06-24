// ========================================================================
//? import
// ========================================================================

import { Table, Column, Model, DataType, PrimaryKey, HasMany } from "sequelize-typescript";

// models
import { AcademicRecordsModel } from "../academicRecords/academic-records.model";
import { OfferedCoursesModel } from "../offered-courses/offered-courses.model";

import { Course } from "./interfaces/courses.interface";

// ========================================================================
@Table({ tableName: "courses" })
export class CoursesModel extends Model<CoursesModel> implements Course {

    // Id =============================
    @PrimaryKey
    @Column(DataType.STRING(8))

    declare id: string;

    // code =============================
    @Column(DataType.STRING(50))

    declare code: string;

    // title =============================
    @Column(DataType.STRING(250))

    declare title: string;

    // credit =============================
    @Column(DataType.INTEGER)

    declare credit: number;

    // Associations --------------------------------------
    @HasMany(() => AcademicRecordsModel)
    declare academicRecords: AcademicRecordsModel[];

    @HasMany(() => OfferedCoursesModel)
    declare offeredCourses: OfferedCoursesModel[];
}
