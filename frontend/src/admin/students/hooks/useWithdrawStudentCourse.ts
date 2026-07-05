import { useMutation, useQueryClient } from '@tanstack/react-query';
import { withdrawStudentFromCourse } from '../../courses/courses.service';
import { notification } from 'antd';
// =======================================================================
//? withdraw student from course
// api: /courses/withdraw/:studentId/:courseId
// =======================================================================

export const useWithdrawStudentCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: withdrawStudentFromCourse,
        onSuccess: () => {
            // Invalidate both the current courses query and the student list/detail query
            queryClient.invalidateQueries({ queryKey: ['CurrentStudentCoursesForAdmin'] });
            queryClient.invalidateQueries({ queryKey: ['offeredCourses'] });
        },
        onError: (error: Error) => {
            console.log("Error [Withdraw Student's course]:", error);
            queryClient.invalidateQueries({ queryKey: ['CurrentStudentCoursesForAdmin'] });
        },
    });
}; 