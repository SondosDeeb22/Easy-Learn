
// service
import { getStudents } from "../services/users.service";
import { FilterdStudentInterface, StudentFilterParams } from "../interfaces/users.interface";

// react query
import { useQuery, keepPreviousData } from "@tanstack/react-query";
// =======================================================================
//? Fetch students data
// api: /users/students
// =======================================================================

export const useStudents = (page: number, limit: number, filters?: StudentFilterParams) => {

    return useQuery({
        queryKey: ['students', page, filters],
        queryFn: () => getStudents(page, limit, filters),
        placeholderData: keepPreviousData, // keep the content visible while we fetch the next page content
        staleTime: 1000 * 60, // give 1 min to decided if data is fresh (no need for refetch) or > 1 min , stale data, next time used we refetch
    });
}