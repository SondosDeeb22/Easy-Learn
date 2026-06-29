// services
import { getAllStudnetCourses } from '../services/courses.service'

// react query
import { useQuery, keepPreviousData } from '@tanstack/react-query';

// =======================================================================
//? fetch current semester courses
// api: /courses/all 
// ==============================================================
export const useAllStudentCourses = (page: number, limit: number) => {
    return useQuery({
        queryKey: ['allStudentCourses', page],
        queryFn: () => getAllStudnetCourses(page, limit),
        placeholderData: keepPreviousData, // keep the content visible while we fetch the next page content
        staleTime: 1000 * 60, // give 1 min to decided if data is fresh (no need for refetch) or > 1 min, then stale data so next time used we refetch
    });
};