// ========================================================================
//? import
// ========================================================================
import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";

// models
import { CoursesModel } from "../courses/courses.model";
import { SemestersModel } from "../semesters/semesters.model";

import { OfferedCourse } from "./interfaces/offeredCourses.interface";
// ========================================================================
@Table({ tableName: "offered_courses" })
export class OfferedCoursesModel extends Model<OfferedCoursesModel> implements OfferedCourse {
    // id =============================================
    @PrimaryKey
    @Column(DataType.STRING(8))

    declare id: string;

    // courseId =============================================
    @ForeignKey(() => CoursesModel)
    @Column(DataType.STRING(8))

    declare courseId: string;

    // semesterId =============================================
    @ForeignKey(() => SemestersModel)
    @Column(DataType.STRING(8))

    declare semesterId: string;

    // relations --------------------------------------
    @BelongsTo(() => CoursesModel)
    declare course: CoursesModel;

    @BelongsTo(() => SemestersModel)
    declare semester: SemestersModel;
}
