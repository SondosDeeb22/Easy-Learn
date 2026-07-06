import { useQuery } from '@tanstack/react-query';


import { getCourses } from "../courses.service";

import { CourseFilterParams } from '../courses.interface';

// =======================================================================
//? fetch filtered coursess
// ==============================================================

export const useCourses = (filters: CourseFilterParams, page: number, limit: number) => {
    return useQuery({
        queryKey: ['Courses', filters, page, limit],
        queryFn: () => getCourses(filters, page, limit),
        staleTime: 5 * 60 * 1000,
    })
}
