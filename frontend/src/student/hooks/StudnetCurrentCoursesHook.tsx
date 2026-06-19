import { useEffect, useState } from 'react';

// services
import { getStudentCurrentCourses } from '../services/courses.service';

// interace
import { StudentCurrentCourses } from '../interfaces/courses.interface';


// =======================================================================
//? fetch current semester courses
// api: /courses/current 
// ==============================================================
export const useStudentCurrentCourses = () => {
    const [data, setData] = useState<StudentCurrentCourses[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const result = await getStudentCurrentCourses();
                setData(result);
            } catch (err) {
                setError('Failed to load courses. Please, try later');
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    return { data, loading, error };
};