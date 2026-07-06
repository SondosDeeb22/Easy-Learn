import { useQuery } from "@tanstack/react-query";

import { getStudentData } from "../studentData.service";


// =======================================================================
//? fetch user data
// ==============================================================
export const useStudentData = (studentId?: string) => {
    return useQuery({
        queryKey: ['studentData', studentId],
        queryFn: () => getStudentData(studentId!),
        enabled: !!studentId,
        staleTime: 5 * 60 * 1000,
    });
};