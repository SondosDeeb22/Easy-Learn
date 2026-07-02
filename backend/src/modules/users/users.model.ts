// =============================================================
//? Importing
// =============================================================
import { Table, Column, Model, DataType, PrimaryKey, HasMany, AllowNull } from "sequelize-typescript";
import { Exclude } from "class-transformer";
import { AcademicRecordsModel } from "../academicRecords/academic-records.model";


import { User } from "./interfaces/user.interface";

import { GPARecordsModel } from "../grades/gpa-records.model";
//enum 
import { Roles, Gender, Status } from "./enums/users.enum";


// =============================================================
@Table({ tableName: "users" })
export class UsersModel extends Model<UsersModel, User> implements User {

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
    @AllowNull(true)
    @Column(DataType.INTEGER)

    declare currentSemesterCredits: number | null;

    // total credit ==============================================
    @AllowNull(true)
    @Column(DataType.INTEGER)

    declare totalCredits: number | null;

    // CGPA ==============================================
    @AllowNull(true)
    @Column(DataType.DOUBLE(4, 2))

    declare cgpa: number | null;

    // status ==============================================
    @Column(DataType.ENUM(...Object.values(Status)))

    declare status: Status;


    // Associations ========================================
    @HasMany(() => AcademicRecordsModel)
    declare academicRecords: AcademicRecordsModel[];


    @HasMany(() => GPARecordsModel)
    declare gpaRecords: GPARecordsModel[];
}
