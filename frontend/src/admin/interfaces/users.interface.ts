import { Gender } from "../../shared/enums/gender.enum"



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

// // =============================================================
// // student data we pass to admin page
// // =============================================================
// export interface StudentForAdmin {
//     id: string;
//     name: string;
//     gender: string;
//     currentSemesterCredits: number;
//     totalCredits: number;
// }
