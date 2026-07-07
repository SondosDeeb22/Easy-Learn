
// service
import { getFilteredStudents } from "../users.service";
import { FilterdStudentInterface, StudentFilterParams } from "../users.interface";

// react query
import { useQuery } from "@tanstack/react-query";
// =======================================================================
//? Fetch students data
// =======================================================================

export const useStudents = (params: { page?: number; limit?: number } & StudentFilterParams) => {

    return useQuery({
        queryKey: ['students', params],
        queryFn: () => getFilteredStudents(params),
        staleTime: 1000 * 60,
    });
}