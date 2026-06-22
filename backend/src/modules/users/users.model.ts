// =============================================================
//? Importing
// =============================================================
import { Table, Column, Model, DataType, PrimaryKey, HasMany } from "sequelize-typescript";
import { Exclude } from "class-transformer";
import { AcademicRecordsModel } from "../academicRecords/academicRecords.model";


import { UserInterface } from "./interfaces/user.interface";

//enum 
import { Roles } from "./enums/roles.enum";
import { Gender } from "./enums/gender.enum";
// =============================================================
@Table({ tableName: "users" })
export class UsersModel extends Model<UsersModel> implements UserInterface {

    // id =============================================
    @PrimaryKey
    @Column(DataType.STRING)

    declare id: string;

    // name ==============================================
    @Column(DataType.STRING)

    declare name: string;

    // Roles ==============================================
    @Column({
        type: DataType.ENUM(...Object.values(Roles)),
    })

    declare role: Roles;

    // birthDate ==============================================
    @Column(DataType.DATE)

    declare birthDate: Date;

    // gender ==============================================
    @Column({
        type: DataType.ENUM(...Object.values(Gender)),
    })

    declare gender: Gender;

    // email ==============================================
    @Column({
        type: DataType.STRING,
        unique: true // ensure uniqueness on database level
    })

    declare email: string;

    // password ==============================================
    @Column(DataType.STRING)
    @Exclude()
    declare password: string;

    // credit ==============================================
    @Column(DataType.INTEGER)

    declare currentSemesterCredits: number;

    // total credit ==============================================
    @Column(DataType.INTEGER)

    declare totalCredits: number;

    // Associations ========================================
    @HasMany(() => AcademicRecordsModel)
    declare academicRecords: AcademicRecordsModel[];


}
