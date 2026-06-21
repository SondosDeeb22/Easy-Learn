// interface for the model
export interface Course {
    id: string;
    code: string;
    title: string;
    credit: number;
}

// interface for retrieved courses
export interface CourseWithGrade extends Course {
    grade?: string | null,

}

export interface AllStudentCourses {
    courses: CourseWithGrade[],
    totalRows: number;
}

// =========================================================== 

export interface CurrentStudentCourses {
    semesterTitle: string,
    startDate: Date,
    endDate: Date,
    totalRows: number,
    courses: CourseWithGrade[],
}

// =========================================================== 

export interface OfferedCoursesInterface {
    remainingCredits: number;
    courses: CourseWithGrade[];
    totalRows: number
};

// =========================================================== 
export interface Course {
    id: string,
    code: string,
    title: string,
}
// =========================================================== 

export interface Semester {
    id: string,
    title: string,
}