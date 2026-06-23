import { useQuery, keepPreviousData } from '@tanstack/react-query';

//service
import { getAvailableCoursesForStudent } from '../services/offeredCourses.service';

// =======================================================================
//? fetch offered(available) courses for this semester
// api: /courses/offered 
// ==============================================================
export const useOfferedCourses = (page: number, limit: number) => {
    // page parameter to define which page the user is currently on 

    return useQuery({
        queryKey: ['offeredCourses', page],
        queryFn: () => getAvailableCoursesForStudent(page, limit),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60,
    });
};
