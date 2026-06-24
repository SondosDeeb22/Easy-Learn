// =============================================================
//? Importing
// =============================================================
import { Table, Column, Model, DataType, PrimaryKey, HasMany, AllowNull } from "sequelize-typescript";
import { Exclude } from "class-transformer";
import { AcademicRecordsModel } from "../academicRecords/academic-records.model";


import { UserInterface } from "./interfaces/user.interface";

import { GPARecordsModel } from "../grades/gpa-records.model";
//enum 
import { Roles } from "./enums/roles.enum";
import { Gender } from "./enums/gender.enum";
import { Optional } from "@nestjs/common";
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

    // Associations ========================================
    @HasMany(() => AcademicRecordsModel)
    declare academicRecords: AcademicRecordsModel[];


    @HasMany(() => GPARecordsModel)
    declare gpaRecords: GPARecordsModel[];
}
