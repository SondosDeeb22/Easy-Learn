// interface for the model
export interface Course {
    id: string;
    code: string;
    title: string;
    credit: number;
    active: boolean;
}

// =========================================================== 

// interface for retrieved courses
export interface CourseWithGrade extends Course {
    numericGrade?: number | null,
    letterGrade?: string | null,

}
// =========================================================== 

export interface AllStudentCourses {
    courses: CourseWithGrade[],
    totalRows: number;
}

// =========================================================== 


export interface AllCourses {
    courses: Course[] | [],
    totalRows: number;
}

// =========================================================== 

export interface CurrentStudentCourses {
    semesterId: string,
    semesterTitle: string,
    startDate: Date,
    endDate: Date,
    totalRows: number,
    page?: number,
    limit?: number,
    courses: CourseWithGrade[],
}


// =========================================================== 
export interface Course {
    id: string,
    code: string,
    title: string,
}
// ========================================================

export type CoursesQueryParams = {
    code?: string;
    title?: any;
    active?: boolean;
};
