import { useQuery } from '@tanstack/react-query';

//service
import { getOfferedCoursesForStudent } from '../offeredCourses.service';

// =======================================================================
//? fetch offered(available) courses for this semester
// api: /courses/offered 
// ==============================================================
export const useOfferedCourses = (page?: number, limit?: number) => {
    // page parameter to define which page the user is currently on 

    return useQuery({
        queryKey: ['offeredCourses', page, limit],
        queryFn: () => getOfferedCoursesForStudent("", page, limit),
        staleTime: 1000 * 60,
    });
};
