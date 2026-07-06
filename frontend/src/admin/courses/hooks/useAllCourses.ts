import { useQuery } from '@tanstack/react-query';
import { getCourses } from "../courses.service";

// =======================================================================
//? fetch all courses
// ==============================================================

export const useAllCourses = () => {
    return useQuery({
        queryKey: ['AllCourses'],
        queryFn: () => getCourses({}, 1, 100),
        staleTime: 5 * 60 * 1000,
    })
}