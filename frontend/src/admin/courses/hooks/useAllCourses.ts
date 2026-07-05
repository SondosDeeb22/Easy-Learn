import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCourses } from "../courses.service";

// =======================================================================
//? fetch all courses
// ==============================================================

export const useAllCourses = () => {
    return useQuery({
        queryKey: ['AllCourses'],
        queryFn: () => getCourses({}, 1, 100),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        enabled: true,
    })
}