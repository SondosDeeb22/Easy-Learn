import { useEffect, useState } from 'react';

// services
import { getOfferedCourses } from '../services/courses.service';

// interace
import { OfferedCourses } from '../interfaces/courses.interface';


// =======================================================================
//? fetch current semester courses
// api: /courses/offered 
// ==============================================================
export const useOfferedCourses = () => {
    const [data, setData] = useState<OfferedCourses[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const result = await getOfferedCourses();
            setData(result);
        } catch (err) {
            setError('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return { data, loading, error, refetch: fetchCourses };
};