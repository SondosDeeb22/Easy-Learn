import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCourse } from '../courses.service';
import { Course } from '../courses.interface';

// =======================================================================
//? Update course details
// =======================================================================

export const useUpdateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Course) => updateCourse(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Courses'] });
            queryClient.invalidateQueries({ queryKey: ['AllCourses'] });
        },
        onError: (error: any) => {
            queryClient.invalidateQueries({ queryKey: ['Courses'] });
            queryClient.invalidateQueries({ queryKey: ['AllCourses'] });
            console.log(`Error [useUpdateCourse] -> ${error.message}`)
        },
    });
};
