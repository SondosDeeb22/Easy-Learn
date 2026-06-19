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

// was used in exlucidng password from studnet data, now i use interceptor instead
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


// ============================================

export interface filterdStudentInterface {
    id: string,
    name: string,
    birthDate: Date,
    email: string,
    gender: Gender,
    currentSemesterCredit: number,
    totalCredit: number,
}

