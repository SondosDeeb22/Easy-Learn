import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStudentGrade } from '../../academicRecords/academicRecords.service';
import { notification } from 'antd';
// =======================================================================
//? update student grade
// =======================================================================

export const useUpdateStudentGrade = () => {
    const queryClient = useQueryClient();
    const [api, contextHolder] = notification.useNotification();

    return useMutation({
        mutationFn: updateStudentGrade,
        onSuccess: (_data, variables) => {
            // Invalidate courses table
            queryClient.invalidateQueries({ queryKey: ['CurrentStudentCoursesForAdmin'] });
            // Invalidate GPA (all semesters for any student that may be affected)
            queryClient.invalidateQueries({ queryKey: ['studentGPA'] });
            // Invalidate student data (credits, cgpa, etc.)
            queryClient.invalidateQueries({ queryKey: ['studentData'] });
        },
        onError: (error: Error) => {
            console.log("error in updating grade :", error);
        },
    });
};