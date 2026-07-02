import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCourse } from '../services/courses.service';
import { CreateCourseData } from '../interfaces/courses.interface';

// =======================================================================
//? Create new course
// =======================================================================

export const useCreateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCourseData) => createCourse(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Courses'] });
            queryClient.invalidateQueries({ queryKey: ['AllCourses'] });
        },
        onError: (error: any) => {
            queryClient.invalidateQueries({ queryKey: ['Courses'] });
            queryClient.invalidateQueries({ queryKey: ['AllCourses'] });
            console.log(`Error [useCreateCourse] -> ${error.message}`)
        },
    });
};
