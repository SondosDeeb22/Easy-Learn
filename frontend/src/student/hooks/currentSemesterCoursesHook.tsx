import { useEffect, useState } from 'react';

// services
import { getCurrentSemesterCourses } from '../services/course.service';

// interace
import { CurrentSemesterCourses } from '../interfaces/course.interface';


// =======================================================================
//? fetch current semester courses
// api: /courses/current 
// ==============================================================
export const useCurrentSemesterCourses = () => {
    const [data, setData] = useState<CurrentSemesterCourses[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const result = await getCurrentSemesterCourses();
                setData(result);
            } catch (err) {
                setError('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    return { data, loading, error };
};