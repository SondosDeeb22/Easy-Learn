
export interface OfferedCourse {
    id: string;
    courseId: string;
    semesterId: string;
}

// =========================================================== 

export interface Course {
    id: string;
    code: string;
    title: string;
    credit: number;
}

export interface Semester {
    id: string;
    title: string;
}

// ----------------------------------------------- 
// interface for retrieved courses
export interface CourseWithGrade extends Course {
    grade?: string | null,

}
// ----------------------------------------------- 
export interface OfferedCourses {
    remainingCredits: number;
    courses: CourseWithGrade[];
    totalRows: number
};
// ----------------------------------------------------
export interface DetailedOfferedCourse {
    id: string,
    courseId: string,
    semesterId: string,
    course: Course | null,
    semester: Semester | null

}
export interface AdminOfferedCourses {
    courses: DetailedOfferedCourse[];
    totalRows: number
}

// =========================================================== 


export interface AvailableCourses {
    courses: Course[] | [] | null;
    totalRows: number;

}