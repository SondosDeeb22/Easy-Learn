import { apiClient } from '../../shared/services/apiClient';
import { OfferedCoursesWithCredits } from '../interfaces/offeredCourse.interface';


//=====================================================
//? Get offered courses
//=====================================================

export const getAvailableCoursesForStudent = async (studentId: string, page: number, limit: number): Promise<OfferedCoursesWithCredits> => {
    const response = await apiClient.get(`/api/offered-courses?page=${page}&limit=${limit}&studentId=${studentId}`);
    console.log(`this is response for /offered-courses?page=${page}&limit=${limit}`, response.data.data);

    const { remainingCredits, courses, totalRows } = response.data.data;
    if (!Array.isArray(courses)) {
        throw new Error("Expected courses to be an array");
    }
    console.log("this is response for /offered-courses:", response.data);
    return { remainingCredits, courses, totalRows };
}
