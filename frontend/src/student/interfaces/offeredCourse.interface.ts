export interface CourseWithGrade {
    id: string
    code: string;
    title: string;
    credit: number;
    grade?: string | null;
}

export interface OfferedCoursesWithCredits {
    remainingCredits: number;
    courses: CourseWithGrade[];
    totalRows: number;
};
