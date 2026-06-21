import { useState, useEffect } from "react";
import { getStudentForAdmin } from "../services/users.service";
import { Student } from "../interfaces/users.interface";

// =======================================================================
//? fetch semesters data
// api: /courses/semesters
// ==============================================================

export const useStudentDetails = (studentId: string) => {
    const [data, setData] = useState<Student>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // don't fetch if no studentId provided
        if (!studentId) {
            setData(undefined);
            setLoading(false);
            return;
        }

        const fetch = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getStudentForAdmin(studentId);
                setData(result);
            } catch (err) {
                console.log("error(useStudentDetails):", err);
                setData(undefined);
                setError(`Failed to load student data. Please, try later`);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [studentId]);

    return { data, loading, error };
}