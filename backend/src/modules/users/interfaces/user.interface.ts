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
    currentSemesterCredits?: number,
    totalCredits?: number,
}

// was used in exlucidng password from studnet data, now i use interceptor instead
export interface StudnetData {
    id: string,
    name: string,
    role: Roles,
    birthDate: Date,
    email: string,
    gender: Gender,
    currentSemesterCredits: number,
    totalCredits: number,
    maxCredits: number

}


// ============================================

export interface filterdStudent {
    id: string,
    name: string,
    birthDate: Date,
    email: string,
    gender: Gender,
    currentSemesterCredits: number,
    totalCredits: number,
}


export interface studentData {
    totalRows: number
    students: filterdStudent[],
}

