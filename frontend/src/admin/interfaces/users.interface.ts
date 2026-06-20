import { Gender } from "../../shared/enums/gender.enum"



export interface StudentFilterParams {
    studentId?: string
    courseId?: string;
    semesterId?: string;

}
export interface filterdStudentInterface {
    id: string,
    name: string,
    birthDate: Date,
    email: string,
    gender: Gender,
    currentSemesterCredit: number,
    totalCredit: number,
}

