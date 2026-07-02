import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCourses } from "../services/courses.service";
import { CourseFilterParams } from '../interfaces/courses.interface';

// =======================================================================
//? fetch filtered courses
// api: /courses
// ==============================================================

export const useCourses = (filters: CourseFilterParams, page: number, limit: number) => {
    return useQuery({
        queryKey: ['Courses', filters, page, limit],
        queryFn: () => getCourses(filters, page, limit),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        enabled: true,
    })
}
