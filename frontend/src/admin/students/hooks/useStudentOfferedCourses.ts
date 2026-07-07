import { useQuery } from '@tanstack/react-query';

//service
import { getOfferedCoursesForStudent } from '../../../student/offeredCourses/offeredCourses.service';

// =======================================================================
//? fetch offered(available) courses for this semester
// ==============================================================
export const useStudentOfferedCourses = (studentId: string, page?: number, limit?: number) => {
    // page parameter to define which page the user is currently on 

    return useQuery({
        queryKey: ['offeredCourses', studentId, page, limit],
        queryFn: () => getOfferedCoursesForStudent(studentId, page, limit),
        staleTime: 1000 * 60,
        enabled: !!studentId,
    });
};
