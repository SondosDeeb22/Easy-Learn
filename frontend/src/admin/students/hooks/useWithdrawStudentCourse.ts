import { useMutation, useQueryClient } from '@tanstack/react-query';
import { withdrawStudentFromCourse } from '../../courses/courses.service';
import { notification } from 'antd';
// =======================================================================
//? withdraw student from course
// =======================================================================

export const useWithdrawStudentCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: withdrawStudentFromCourse,
        onSuccess: () => {
            // Invalidate courses table and offered courses
            queryClient.invalidateQueries({ queryKey: ['CurrentStudentCoursesForAdmin'] });
            queryClient.invalidateQueries({ queryKey: ['offeredCourses'] });
            // Invalidate GPA (all semesters for any affected student)
            queryClient.invalidateQueries({ queryKey: ['studentGPA'] });
            // Invalidate student data (credits, cgpa, etc.)
            queryClient.invalidateQueries({ queryKey: ['studentData'] });

            queryClient.invalidateQueries({ queryKey: ['studentDetails'] });
        },
        onError: (error: Error) => {
            console.log("Error [Withdraw Student's course]:", error);
        },
    });
}; 