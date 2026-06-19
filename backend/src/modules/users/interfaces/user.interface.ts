// ====================================================================
//? import  
// ====================================================================
import { Roles } from "../enums/roles.enum"
import { Gender } from "../enums/gender.enum"
// ====================================================================

export interface UserInterface {
    id: string,
    name: string,
    role: Roles,
    birthDate: Date,
    email: string,
    gender: Gender,
    password: string,
    currentSemesterCredit?: number,
    totalCredit?: number,
}

export interface StudnetData {
    id: string,
    name: string,
    role: Roles,
    birthDate: Date,
    email: string,
    gender: Gender,
    currentSemesterCredit: number,
    totalCredit: number,
    maxCredits: number

}