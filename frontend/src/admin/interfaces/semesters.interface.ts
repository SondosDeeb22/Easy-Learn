export interface Semester {
    id: string;
    title: string;
    startDate?: string;
    endDate?: string;
    maxCredits?: number;
}


export interface GetSemestersParam {
    title?: string;
    date?: string;
    page?: number;
    limit?: number;
}


export interface GetSemestersResult {
    semesters: Semester[] | [];
    totalRows?: number;
}

