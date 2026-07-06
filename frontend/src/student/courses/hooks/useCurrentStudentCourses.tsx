// services
import { getCurrentStudentCourses } from '../courses.service';
// react query
import { useQuery } from '@tanstack/react-query';


// =======================================================================
//? fetch current semester courses
// api: /courses/current 
// ==============================================================
export const useCurrentStudentCourses = () => {
    return useQuery({
        queryKey: ['currentStudentCourses'],
        queryFn: () => getCurrentStudentCourses(),
        staleTime: 5 * 60 * 1000,
    });
};