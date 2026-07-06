import { useQuery } from '@tanstack/react-query';
//service
import { getStudentCurrentCoursesForAdmin } from '../../courses/courses.service';

// ==========================================================================
//? fetch the current semester courses for a specific student
// =======================================================================

export const useStudentCurrentCourses = (
  studentId: string
) => {
  return useQuery({
    queryKey: ['CurrentStudentCoursesForAdmin', studentId],
    queryFn: () => getStudentCurrentCoursesForAdmin(studentId),
    staleTime: 5 * 60 * 1000,
    enabled: !!studentId,
  });
};
