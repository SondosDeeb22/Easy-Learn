export interface Course {
    code: string;
    title: string;
    credit: number;
    grade?: string | null;
}
//===================================================

export interface StudentCurrentCourses {
    semesterTitle: string;
    startDate: string;
    endDate: string;
    courses: Course[];
}


//===================================================
export interface OfferedCourses extends Course {
    id: string;
}

//===================================================


export interface OfferedCoursesWithCredits {
    remainingCredits: number;
    courses: OfferedCourses[];
    totalRows: number;
};