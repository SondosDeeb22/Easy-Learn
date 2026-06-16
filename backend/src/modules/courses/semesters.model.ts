// ========================================================================
//? import
// ========================================================================
import { Table, Column, Model, DataType, PrimaryKey, HasMany } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

// models
import { AcademicRecordsModel } from "../users/academicRecords.model";
import { OfferedCoursesModel } from "./offeredCourses.model";

import { SemestersInterface } from "./interfaces/semesters.interface";
// ========================================================================
@Table({ tableName: "semester" })
export class SemestersModel extends Model<SemestersModel> implements SemestersInterface {
    // id =============================================
    @PrimaryKey
    @Column(DataType.STRING(8))
    @ApiProperty()
    declare id: string;

    // title =============================================
    @Column(DataType.STRING(250))
    @ApiProperty()
    declare title: string;

    // startDate =============================================
    @Column(DataType.DATE)
    @ApiProperty()
    declare startDate: Date;

    // endDate =============================================
    @Column(DataType.DATE)
    @ApiProperty()
    declare endDate: Date;

    // maxCredits =============================================
    @Column({
        type: DataType.INTEGER,
        field: 'maxCredtis'
    })
    @ApiProperty()
    declare maxCredits: number;

    // Associations --------------------------------------
    @HasMany(() => AcademicRecordsModel)
    declare academicRecords: AcademicRecordsModel[];

    @HasMany(() => OfferedCoursesModel)
    declare offeredCourses: OfferedCoursesModel[];
}
