import { useQuery, keepPreviousData } from '@tanstack/react-query';

//service
import { getOfferedCoursesForStudent } from '../../student/services/offeredCourses.service';

// =======================================================================
//? fetch offered(available) courses for this semester
// api: /courses/offered 
// ==============================================================
export const useStudentOfferedCourses = (studentId: string, page: number, limit: number) => {
    // page parameter to define which page the user is currently on 

    return useQuery({
        queryKey: ['offeredCourses', studentId, page],
        queryFn: () => getOfferedCoursesForStudent(studentId, page, limit),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60,
        enabled: !!studentId,
    });
};
