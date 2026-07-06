// services
import { getAllStudnetCourses } from '../courses.service'

// react query
import { useQuery } from '@tanstack/react-query';

// =======================================================================
//? fetch current semester courses
// api: /courses/all 
// ==============================================================
export const useAllStudentCourses = (page: number, limit: number) => {
    return useQuery({
        queryKey: ['allStudentCourses', page],
        queryFn: () => getAllStudnetCourses(page, limit),
        staleTime: 1000 * 60,
    });
};