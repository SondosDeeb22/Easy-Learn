import { useQuery } from "@tanstack/react-query";
import { getStudentForAdmin } from "../users.service";

// =======================================================================
//? fetch semesters data
// ==============================================================

export const useStudentDetails = (studentId?: string) => {
    return useQuery({
        queryKey: ["studentDetails", studentId],
        queryFn: () => getStudentForAdmin(studentId!),
        enabled: !!studentId, // Only fetch when a studentId is provided
        staleTime: 5 * 60 * 1000,
    });
};