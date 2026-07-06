import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getOfferedCourses,
    createOfferedCourse,
    deleteOfferedCourse,
    getAvailableCourses
} from '../offeredCourses.service';
import { getAllSemesters, getCurrentSemester } from '../../semesters/semesters.service';

// =======================================================================
//? fetch offered courses 
// =======================================================================
export const useAdminOfferedCourses = (semesterId: string | undefined, page: number, limit: number) => {
    return useQuery({
        queryKey: ['AdminOfferedCourses', semesterId, page, limit],
        queryFn: () => getOfferedCourses(semesterId, page, limit),
        staleTime: 2 * 60 * 1000,
    });
};
// =======================================================================
//? fetch Available courses for admin
// =======================================================================
export const useAdminAvailableCourses = (semesterId: string | undefined) => {
    return useQuery({
        queryKey: ['AdminAvailableCourses', semesterId],
        queryFn: () => getAvailableCourses(semesterId!),
        staleTime: 2 * 60 * 1000,
        enabled: !!semesterId,
    });
};


// =======================================================================
//? fetch current active semester
// =======================================================================
export const useCurrentSemester = () => {
    return useQuery({
        queryKey: ['CurrentSemester'],
        queryFn: getCurrentSemester,
        staleTime: 10 * 60 * 1000,
    });
};

// =======================================================================
//? create offered course
// =======================================================================
export const useCreateOfferedCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOfferedCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['AdminOfferedCourses'] });
            queryClient.invalidateQueries({ queryKey: ['AdminAvailableCourses'] });
        },
        onError: (error: any) => {
            console.log(`Error [useCreateOfferedCourse] -> ${error.message}`);
        },
    });
};


// =======================================================================
//? delete offered course
// =======================================================================
export const useDeleteOfferedCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteOfferedCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['AdminOfferedCourses'] });
        },
        onError: (error: any) => {
            console.log(`Error [useDeleteOfferedCourse] -> ${error.message}`);
        },
    });
};
