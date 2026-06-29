
export interface Course {
    id: string,
    code: string,
    title: string
}

export interface Semester {
    id: string,
    title: string
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
