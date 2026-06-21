import { useState, useEffect } from "react";
import { getAllCourses } from "../services/courses.service";
import { Course } from "../interfaces/courses.interface";

// =======================================================================
//? fetch all courses
// api: /courses/all
// ==============================================================

export const useAllCourses = () => {
    const [data, setData] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const result = await getAllCourses();
                setData(result);
            } catch (err) {
                console.log("error(useAllCourses):", err);
                setError(`Failed to load courses. Please, try later`);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    return { data, loading, error };
}