import { useMutation, useQueryClient } from '@tanstack/react-query';
//service
import { enrollStudent } from '../services/courses.service';

// ==========================================================================
// Hook to enroll a student in an offered course
export const useEnrollStudentInCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ studentId, offeredCourseId }: { studentId: string; offeredCourseId: string }) =>
            enrollStudent(offeredCourseId, studentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['CurrentStudentCoursesForAdmin'] });
            queryClient.invalidateQueries({ queryKey: ['offeredCourses'] });
        },
        onError: (error: Error) => {
            console.log("Error [Enroll Student in course - hook]:", error);

            queryClient.invalidateQueries({ queryKey: ['CurrentStudentCoursesForAdmin'] });
        }
    });
};
