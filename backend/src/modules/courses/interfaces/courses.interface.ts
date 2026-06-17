export interface CourseInterface {
    id: string;
    code: string;
    title: string;
    credit: number;
}

export interface Courses {
    code: string,
    title: string,
    credit: number,
    grade: string,

}
export interface CurrenseSemesterCoursesInterface {
    semesterTitle: string,
    startDate: Date,
    endDate: Date,
    courses: Courses[],
}