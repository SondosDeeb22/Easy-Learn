// services
import { getCurrentStudentCourses } from '../courses.service';
// react query
import { useQuery, keepPreviousData } from '@tanstack/react-query';


// =======================================================================
//? fetch current semester courses
// api: /courses/current 
// ==============================================================
export const useCurrentStudentCourses = () => {
    return useQuery({
        queryKey: ['currentStudentCourses'],
        queryFn: () => getCurrentStudentCourses(),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1
    });
};