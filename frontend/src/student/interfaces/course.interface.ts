export interface Course {
    code: string;
    title: string;
    credit: number;
    grade: string;
}

//===================================================

export interface CurrentSemesterCourses {
    semesterTitle: string;
    startDate: string;
    endDate: string;
    courses: Course[];
}