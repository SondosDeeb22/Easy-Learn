import { apiClient } from '../../shared/services/apiClient';

//interface
import { OfferedCoursesResult, AvailableCourses } from '../offeredCourses/offeredCourses.interface';

// ==================================================================================================
//? Get offered courses for admin (filterable by semester)
// ==================================================================================================
export const getOfferedCourses = async (
    semesterId: string | undefined,
    page: number,
    limit: number
): Promise<OfferedCoursesResult> => {
    try {
        const params = new URLSearchParams();
        if (semesterId) params.append('semesterId', semesterId);
        params.append('page', String(page));
        params.append('limit', String(limit));

        const response = await apiClient.get(`/api/offered-courses/admin?${params.toString()}`);
        console.log('Response for GET /api/offered-courses/admin', response.data.data);

        return response.data.data;
    } catch (error: any) {
        console.log(`Error [frontend/offeredCourses.service - getOfferedCourses]:`, error.message);
        throw new Error(error.response?.data?.message || 'Failed to get offered courses');
    }

};

// ==================================================================================================
//? Get Available courses(the ones we can add to offered courses) for admin (filterable by semester)
// ==================================================================================================
export const getAvailableCourses = async (semesterId: string): Promise<AvailableCourses> => {
    try {
        const response = await apiClient.get(`/api/offered-courses/available-courses/${semesterId}?page=1&limit=100`);
        return response.data.data;
    } catch (error: any) {
        console.log(`Error [frontend/offeredCourses.service - getAvailableCourses]:`, error.message);
        throw new Error(error.response?.data?.message || 'Failed to get available courses');
    }

}

// ==================================================================================================
//? Create offered course
// ==================================================================================================
export const createOfferedCourse = async (data: { courseId: string; semesterId: string }): Promise<void> => {
    try {
        await apiClient.post(`/api/offered-courses/add`, data);
    } catch (error: any) {
        console.log(`Error [frontend/offeredCourses.service - createOfferedCourse]:`, error.message);
        throw new Error(error.response?.data?.message || 'Failed to add offered course');
    }
};

// ==================================================================================================
//? Delete offered course
// ==================================================================================================
export const deleteOfferedCourse = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/api/offered-courses/${id}`);
    } catch (error: any) {
        console.log(`Error [frontend/offeredCourses.service - deleteOfferedCourse]:`, error.message);
        throw new Error(error.response?.data?.message || 'Failed to delete offered course');
    }
};
