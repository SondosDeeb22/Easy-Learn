import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStudentGrade } from '../services/academicRecords.service';
import { notification } from 'antd';
// =======================================================================
//? update student grade
// api: /academic-records/grade
// =======================================================================

export const useUpdateStudentGrade = () => {
    const queryClient = useQueryClient();
    const [api, contextHolder] = notification.useNotification();

    return useMutation({
        mutationFn: updateStudentGrade,
        onSuccess: () => {
            // Invalidate both the current courses query and the student list/detail query
            queryClient.invalidateQueries({ queryKey: ['CurrentStudentCoursesForAdmin'] });
        },
        onError: (error: Error) => {
            console.log("error in updating grade :", error);
            queryClient.invalidateQueries({ queryKey: ['CurrentStudentCoursesForAdmin'] });
        },
    });
};