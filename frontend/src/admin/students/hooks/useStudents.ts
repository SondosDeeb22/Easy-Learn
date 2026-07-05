
// service
import { getFilteredStudents } from "../users.service";
import { FilterdStudentInterface, StudentFilterParams } from "../users.interface";

// react query
import { useQuery, keepPreviousData } from "@tanstack/react-query";
// =======================================================================
//? Fetch students data
// api: /users/students
// =======================================================================

export const useStudents = (params: { page: number; limit: number } & StudentFilterParams) => {

    return useQuery({
        queryKey: ['students', params],
        queryFn: () => getFilteredStudents(params),
        placeholderData: keepPreviousData, // keep the content visible while we fetch the next page content
        staleTime: 1000 * 60, // give 1 min to decided if data is fresh (no need for refetch) or > 1 min , stale data, next time used we refetch
    });
}