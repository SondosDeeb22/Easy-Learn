import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getOfferedCourses } from '../services/courses.service';


// =======================================================================
//? fetch offered(available) courses for this semester
// api: /courses/offered 
// ==============================================================
export const useOfferedCourses = (page: number, limit: number = 8) => {
    // page parameter to define which page the user is currently on 

    return useQuery({
        queryKey: ['offeredCourses', page],
        queryFn: () => getOfferedCourses(page, limit),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60,
    });
};
