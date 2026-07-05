import { useState, useEffect } from "react";

import { getStudentData } from "../studentData.service";
import { StudentData } from "../studentData.interface";

// =======================================================================
//? fetch user data
// api: /users/:id
// ==============================================================

export const useStudentData = (studentId?: string) => {
    const [data, setData] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!studentId) {
            setLoading(false);
            return;
        }

        const fetch = async () => {
            try {
                const result = await getStudentData(studentId);
                setData(result);
            } catch (err) {
                console.log("error(useStudentData):", err);
                setError(`Failed to load user data. Please, try later`);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [studentId]);

    return { data, loading, error };
}