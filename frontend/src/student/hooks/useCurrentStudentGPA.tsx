import { useState, useEffect } from "react";

import { getCurrentStudentGPA } from "../services/users.service";

// =======================================================================
//? fetch user data
// /api/users/gpa/${studentId}/${semesterId}
// ==============================================================

export const useCurrentStudentGPA = (studentId?: string, semesterId?: string) => {
    const [data, setData] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!studentId || !semesterId) {
            setLoading(false);
            return;
        }

        const fetch = async () => {
            try {
                const result = await getCurrentStudentGPA(studentId, semesterId);
                console.log(`[frontend - useCurrentStudentGPA.tsx]\n gpa = ${result}`);
                setData(result);
            } catch (err) {
                console.log("error(useStudentData):", err);
                setError(`Failed to load user data. Please, try later`);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [studentId, semesterId]);

    return { data, loading, error };
}