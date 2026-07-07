import { apiClient } from '../../shared/services/apiClient';

//interface
import { OfferedCoursesResult, AvailableCourses } from '../offeredCourses/offeredCourses.interface';

// ==================================================================================================
//? Get offered courses for admin (filterable by semester)
// ==================================================================================================
export const getOfferedCourses = async (
    semesterId: string | undefined,
    page?: number,
    limit?: number
): Promise<OfferedCoursesResult> => {
    const params = new URLSearchParams();
    if (semesterId) params.append('semesterId', semesterId);
    if (page !== undefined) params.append('page', String(page));
    if (limit !== undefined) params.append('limit', String(limit));

    const response = await apiClient.get(`/api/offered-courses/admin?${params.toString()}`);
    console.log('Response for GET /api/offered-courses/admin', response.data.data);

    return response.data.data;
};

// ==================================================================================================
//? Get Available courses(the ones we can add to offered courses) for admin (filterable by semester)
// ==================================================================================================
export const getAvailableCourses = async (semesterId: string): Promise<AvailableCourses> => {
    const response = await apiClient.get(`/api/offered-courses/available-courses/${semesterId}`);
    return response.data.data;
}

// ==================================================================================================
//? Create offered course
// ==================================================================================================
export const createOfferedCourse = async (data: { courseId: string; semesterId: string }): Promise<void> => {
    await apiClient.post(`/api/offered-courses/add`, data);
};

// ==================================================================================================
//? Delete offered course
// ==================================================================================================
export const deleteOfferedCourse = async (id: string): Promise<void> => {
    await apiClient.delete(`/api/offered-courses/${id}`);
};
