import { useQuery } from "@tanstack/react-query";

import { getUserData } from "../../../shared/services/userData.service";


// =======================================================================
//? fetch user data
// ==============================================================
export const useStudentData = (studentId?: string) => {
    return useQuery({
        queryKey: ['studentData', studentId],
        queryFn: () => getUserData(studentId!),
        enabled: !!studentId,
        staleTime: 5 * 60 * 1000,
    });
};