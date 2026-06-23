
export interface OfferedCourse {
    id: string;
    courseId: string;
    semesterId: string;
}

// =========================================================== 

// interface for retrieved courses
export interface CourseWithGrade {
    id: string;
    code: string;
    title: string;
    credit: number;
    grade?: string | null,

}
// ----------------------------------------------- 
export interface OfferedCourses {
    remainingCredits: number;
    courses: CourseWithGrade[];
    totalRows: number
};

// =========================================================== 
