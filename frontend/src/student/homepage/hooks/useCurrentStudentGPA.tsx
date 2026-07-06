import { useQuery } from "@tanstack/react-query";

import { getCurrentStudentGPA } from "../studentData.service";

// =======================================================================
//? fetch user data
// /api/users/gpa/${studentId}/${semesterId}
// ==============================================================

export const useCurrentStudentGPA = (
    studentId?: string,
    semesterId?: string
) => {
    return useQuery({
        queryKey: ['studentGPA', studentId, semesterId],
        queryFn: () => getCurrentStudentGPA(studentId!, semesterId!),
        enabled: !!studentId && !!semesterId,
        staleTime: 5 * 60 * 1000,
    });
};