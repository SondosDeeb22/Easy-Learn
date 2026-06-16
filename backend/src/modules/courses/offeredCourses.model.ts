// ========================================================================
//? import
// ========================================================================
import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

// models
import { CoursesModel } from "./courses.model";
import { SemestersModel } from "./semesters.model";

import { OfferedCoursesInterface } from "./interfaces/offeredCourses.interface";
// ========================================================================
@Table({ tableName: "offered_courses" })
export class OfferedCoursesModel extends Model<OfferedCoursesModel> implements OfferedCoursesInterface {
    // id =============================================
    @PrimaryKey
    @Column(DataType.STRING(8))
    @ApiProperty()
    declare id: string;

    // courseId =============================================
    @ForeignKey(() => CoursesModel)
    @Column(DataType.STRING(8))
    @ApiProperty()
    declare courseId: string;

    // semesterId =============================================
    @ForeignKey(() => SemestersModel)
    @Column(DataType.STRING(8))
    @ApiProperty()
    declare semesterId: string;

    // relations --------------------------------------
    @BelongsTo(() => CoursesModel)
    declare course: CoursesModel;

    @BelongsTo(() => SemestersModel)
    declare semester: SemestersModel;
}
