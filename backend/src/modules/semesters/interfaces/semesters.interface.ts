export interface Semester {
    id: string,
    title: string,
    startDate?: Date,
    endDate?: Date,
    maxCredits?: number,
}

export interface GetSemesters {
    semesters: Semester[] | [];
    totalRows?: number;
}