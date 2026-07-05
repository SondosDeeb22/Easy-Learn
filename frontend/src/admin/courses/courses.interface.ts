
export interface Course {
    id: string;
    code: string;
    title: string;
    credit: number;
    active: boolean;
}

export interface CreateCourseData {
    code: string;
    title: string;
    credit: number;
    active: boolean;
}

export interface CourseFilterParams {
    code?: string;
    title?: string;
    status?: string;
}

export interface Semester {
    id: string,
    title: string
}



export interface AllCourses {
    courses: Course[] | [],
    totalRows: number;
}

// ==============================================================================================
// interface for the current semester courses
// ==============================================================================================
export interface CourseWithGrade {
    academicRecordId: string
    id: string
    code: string;
    title: string;
    credit: number;
    numericGrade?: number | null;
}

export interface CurrentStudentCourses {
    semesterTitle: string,
    startDate: Date,
    endDate: Date,
    totalRows: number,
    courses: CourseWithGrade[],
}

// ==========================================================
export interface WithdrawStudentCourse {
    studentId: string;
    courseId: string;
}
