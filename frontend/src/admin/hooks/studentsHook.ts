import { useState, useEffect } from "react";

import { getStudents } from "../services/users.service";
import { filterdStudentInterface, StudentFilterParams } from "../interfaces/users.interface";

// =======================================================================
//? Fetch students data
// api: /users/students
// =======================================================================

export const useStudents = (filters?: StudentFilterParams) => {
    const [data, setData] = useState<filterdStudentInterface | filterdStudentInterface[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const result = await getStudents(filters);
                setData(result);
            } catch (err) {
                console.log("error(useStudents):", err);
                setError(`Failed to load students data. Please, try later`);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    return { data, loading, error };
}