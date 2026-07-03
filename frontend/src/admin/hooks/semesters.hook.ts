import { useQuery } from '@tanstack/react-query';

// api
import { getAllSemesters } from '../services/semesters.service';

// =======================================================================
//? fetch all semesters
// =======================================================================
export const useAllSemesters = () => {
    return useQuery({
        queryKey: ['AllSemesters'],
        queryFn: getAllSemesters,
        staleTime: 10 * 60 * 1000,
    });
};