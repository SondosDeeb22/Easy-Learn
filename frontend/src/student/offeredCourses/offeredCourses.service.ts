import { apiClient } from '../../shared/services/apiClient';
import { OfferedCoursesWithCredits } from './offeredCourse.interface';


//=====================================================
//? Get offered courses
//=====================================================

export const getOfferedCoursesForStudent = async (studentId: string, page?: number, limit?: number): Promise<OfferedCoursesWithCredits> => {
    const queryParams = new URLSearchParams();
    if (studentId) queryParams.append('studentId', studentId);
    if (page !== undefined) queryParams.append('page', String(page));
    if (limit !== undefined) queryParams.append('limit', String(limit));
    const response = await apiClient.get(`/api/offered-courses?${queryParams.toString()}`);
    console.log(`this is response for /offered-courses`, response.data.data);

    const { remainingCredits, courses, totalRows } = response.data.data;
    if (!Array.isArray(courses)) {
        throw new Error("Expected courses to be an array");
    }
    console.log("this is response for /offered-courses:", response.data);
    return { remainingCredits, courses, totalRows };
}
