export interface CourseWithGrade {
    id: string
    code: string;
    title: string;
    credit: number;
    numericGrade?: number | null;
    letterGrade?: string | null;
}
//===================================================
// get current semester (title, start date, end date, courses)
// view courses to user on homepage

export interface CurrentStudentCourses {
    semesterId: string,
    semesterTitle: string,
    startDate: Date,
    endDate: Date,
    totalRows: number,
    courses: CourseWithGrade[],
}
//==================================================

export interface AllStudentCourses extends CourseWithGrade {
    courses: CourseWithGrade[],
    totalRows: number;
}
//===================================================