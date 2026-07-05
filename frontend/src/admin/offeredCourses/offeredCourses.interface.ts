export interface Course {
    id: string;
    code: string;
    title: string;
    credit: number;
}
// =========================================================== 

export interface OfferedCourse {
    id: string;
    courseId: string;
    semesterId: string;
    course: { id: string; code: string; title: string; credit: number } | null;
    semester: { id: string; title: string } | null;
}

export interface OfferedCoursesResult {
    courses: OfferedCourse[];
    totalRows: number;
}

// ==========================================
export interface AddOfferedCourseModalProps {
    open: boolean;
    defaultSemesterId?: string;
    onClose: () => void;
}
// =========================================================== 


export interface AvailableCourses {
    courses: Course[] | [] | null;
    totalRows: number;

}