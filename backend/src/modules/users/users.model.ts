// =============================================================
//? Importing
// =============================================================
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from "sequelize-typescript";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";


//enum 
import { Roles } from "./enums/roles.enum";
import { Gender } from "./enums/gender.enum";
// =============================================================
@Table({ tableName: "users" })
export class User extends Model<User> {

    // id =============================================
    @PrimaryKey
    @Column(DataType.STRING)
    @ApiProperty()
    declare id: string;

    // name ==============================================
    @Column(DataType.STRING)
    @ApiProperty()
    declare name: string;

    // Roles ==============================================
    @Column({
        type: DataType.ENUM(...Object.values(Roles)),
    })
    @ApiProperty({
        enum: Roles,
        enumName: 'Roles',
    })
    declare role: Roles;

    // birthDate ==============================================
    @Column(DataType.DATE)
    @ApiProperty()
    declare birthDate: Date;

    // gender ==============================================
    @Column({
        type: DataType.ENUM(...Object.values(Gender)),
    })
    @ApiProperty({
        enum: Gender,
        enumName: 'Gender',
    })
    declare gender: Gender;

    // email ==============================================
    @Column({
        type: DataType.STRING,
        unique: true // ensure uniqueness on database level
    })
    @ApiProperty()
    declare email: string;

    // password ==============================================
    @Column(DataType.STRING)
    @Exclude()
    declare password: string;


}
