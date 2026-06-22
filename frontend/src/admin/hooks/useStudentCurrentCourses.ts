import { useQuery, keepPreviousData } from '@tanstack/react-query';
//service
import { getStudentCurrentCoursesForAdmin } from '../services/courses.service';

// ==========================================================================
//  Hook to fetch the current semester courses for a specific student
export const useStudentCurrentCourses = (
  studentId: string
) => {
  return useQuery({
    queryKey: ['studentCurrentCoursesForAdmin', studentId],
    queryFn: () => getStudentCurrentCoursesForAdmin(studentId),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    enabled: !!studentId,
  });
};
