import { useEffect, useState } from 'react';

// services
import { getStudnetCourses } from '../services/course.service';

// interace
import { Course } from '../interfaces/course.interface';


// =======================================================================
//? fetch current semester courses
// api: /courses/all 
// ==============================================================
export const useStudentCourses = () => {
    const [data, setData] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const result = await getStudnetCourses();
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