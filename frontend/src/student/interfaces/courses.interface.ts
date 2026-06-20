export interface CourseWithGrade {
    id: string
    code: string;
    title: string;
    credit: number;
    grade?: string | null;
}
//===================================================
// get current semester (title, start date, end date, courses)
// view courses to user on homepage

export interface CurrentStudentCourses {
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


export interface OfferedCoursesWithCredits {
    remainingCredits: number;
    courses: CourseWithGrade[];
    totalRows: number;
};