// interface for the model
export interface CourseInterface {
    id: string;
    code: string;
    title: string;
    credit: number;
}

// interface for retrieved courses
export interface Courses {
    code: string,
    title: string,
    credit: number,
    grade?: string | null,

}

// interface for current semester courses
export interface CurrenseSemesterCoursesInterface {
    semesterTitle: string,
    startDate: Date,
    endDate: Date,
    courses: Courses[],
}

export interface OfferedCoursesInterface {
    remainingCredits: number;
    courses: Courses[];
    totalRows: number
};
