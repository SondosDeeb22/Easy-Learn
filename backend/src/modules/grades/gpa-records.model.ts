// ========================================================================
//? import
// ========================================================================
import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { Optional } from "sequelize";
// models
import { UsersModel } from "../users/users.model";
import { SemestersModel } from "../semesters/semesters.model";
import { GPARecord } from "./interfaces/gpa-records.interface";

// ========================================================================
@Table({ tableName: "gpa_records" })
export class GPARecordsModel extends Model<GPARecordsModel, GPARecord> implements GPARecord {
    // Creation attributes (GPARecordCreationAttributes) are used because Sequelize operates on model instances internally, but .create() accepts plain object inputs from the service layer.
    // id =============================================
    @PrimaryKey
    @Column(DataType.UUID)
    declare id: string;

    // studentId =============================================
    @ForeignKey(() => UsersModel)
    @Column(DataType.STRING)
    declare studentId: string;

    // semesterId =============================================
    @ForeignKey(() => SemestersModel)
    @Column(DataType.STRING)
    declare semesterId: string;

    // gpa =============================================
    @Column(DataType.DOUBLE(4, 2))
    declare gpa: number;

    // qualityPoints =============================================
    @Column(DataType.DOUBLE(4, 2))
    declare qualityPoints: number;

    // totalCredits =============================================
    @Column(DataType.INTEGER())
    declare totalCredits: number;


    // relations ------------------------------------------

    @BelongsTo(() => UsersModel)
    declare user: UsersModel;

    @BelongsTo(() => SemestersModel)
    declare semester: SemestersModel;
}
