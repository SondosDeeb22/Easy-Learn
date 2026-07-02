// ====================================================================
//? import  
// ====================================================================
import { Roles, Gender, Status } from "../enums/users.enum"
// ====================================================================

export interface User {
    id: string,
    name: string,
    role: Roles,
    birthDate: Date,
    email: string,
    gender: Gender,
    password: string,
    currentSemesterCredits: number | null,
    totalCredits: number | null,
    cgpa: number | null,
    status: Status
}


// ============================================

export interface FilterdStudent {
    id: string,
    name: string,
    birthDate: Date,
    email: string,
    gender: Gender,
    currentSemesterCredits: number | null,
    totalCredits: number | null,
    // we don't fetch the password
}

// ============================================

// was used in exlucidng password from studnet data, now i use interceptor instead
export interface StudnetData extends FilterdStudent {
    maxCredits: number | null  // additional field

}


// ============================================

export interface FilteredStudentData {
    totalRows: number
    students: FilterdStudent[],
}

