import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// api
import { getAllSemesters, createSemester, updateSemester, getCurrentSemester } from './semesters.service';

import { Semester, GetSemestersParam } from './semesters.interface';

// =======================================================================
//? fetch all semesters (unfiltered fallback/legacy)
// =======================================================================
export const useAllSemesters = () => {
    return useQuery({
        queryKey: ['AllSemesters'],
        queryFn: () => getAllSemesters(),
        staleTime: 10 * 60 * 1000,
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
//? fetch semesters with filters and pagination
// =======================================================================
export const useFilteredSemesters = (params?: GetSemestersParam) => {
    return useQuery({
        queryKey: ['Semesters', params],
        queryFn: () => getAllSemesters(params),
        staleTime: 5 * 60 * 1000,
    });
};

// =======================================================================
//? create semester mutation
// =======================================================================
export const useCreateSemester = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Semester) => createSemester(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Semesters'] });
            queryClient.invalidateQueries({ queryKey: ['AllSemesters'] });
        },
        onError: (error: any) => {
            console.log(`Error [useCreateSemester] -> ${error.message}`);

        }
    });
};

// =======================================================================
//? update semester mutation
// =======================================================================
export const useUpdateSemester = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Semester) => updateSemester(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Semesters'] });
            queryClient.invalidateQueries({ queryKey: ['AllSemesters'] });
        },
        onError: (error: any) => {
            console.log(`Error [useUpdateSemester] -> ${error.message}`);

        }
    });
};