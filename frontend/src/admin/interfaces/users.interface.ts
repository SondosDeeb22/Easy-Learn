import { Gender } from "../../shared/enums/gender.enum"
import { Roles } from "../../shared/enums/roles.enum"


export interface StudentFilterParams {
    studentId?: string
    courseId?: string;
    semesterId?: string;

}
export interface FilterdStudentInterface {
    id: string,
    name: string,
    birthDate: Date,
    email: string,
    gender: Gender,
    currentSemesterCredits: number,
    totalCredits: number,
}

// ------------------------------------------------------
export interface User {
    id: string,
    name: string,
    gender: Gender,
    role: Roles,
    email: string,
    currentSemesterCredits: number,
    totalCredits: number,

}
export interface Student {
    id: string,
    name: string,
    gender: Gender,
    currentSemesterCredits: number,
    totalCredits: number,

}

export interface Students {
    totalRows: number,
    students: Student[]
}