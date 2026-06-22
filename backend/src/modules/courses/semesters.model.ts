// ========================================================================
//? import
// ========================================================================
import { Table, Column, Model, DataType, PrimaryKey, HasMany } from "sequelize-typescript";

// models
import { AcademicRecordsModel } from "../academicRecords/academicRecords.model";
import { OfferedCoursesModel } from "./offeredCourses.model";

import { SemestersInterface } from "./interfaces/semesters.interface";
// ========================================================================
@Table({ tableName: "semester" })
export class SemestersModel extends Model<SemestersModel> implements SemestersInterface {
    // id =============================================
    @PrimaryKey
    @Column(DataType.STRING(8))

    declare id: string;

    // title =============================================
    @Column(DataType.STRING(250))

    declare title: string;

    // startDate =============================================
    @Column(DataType.DATE)

    declare startDate: Date;

    // endDate =============================================
    @Column(DataType.DATE)

    declare endDate: Date;

    // maxCredits =============================================
    @Column({
        type: DataType.INTEGER,
        field: 'maxCredtis'
    })

    declare maxCredits: number;

    // Associations --------------------------------------
    @HasMany(() => AcademicRecordsModel)
    declare academicRecords: AcademicRecordsModel[];

    @HasMany(() => OfferedCoursesModel)
    declare offeredCourses: OfferedCoursesModel[];
}
