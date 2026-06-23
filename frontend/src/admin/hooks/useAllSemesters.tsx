import { useState, useEffect } from "react";
import { getAllSemesters } from "../services/semesters.service";
import { Semester } from "../interfaces/semesters.interface";

// =======================================================================
//? fetch semesters data
// api: /courses/semesters
// ==============================================================

export const useAllSemesters = () => {
    const [data, setData] = useState<Semester[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const result = await getAllSemesters();
                setData(result);
            } catch (err) {
                console.log("error(useAllSemesters):", err);
                setError(`Failed to load semesters. Please, try later`);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    return { data, loading, error };
}