import { apiClient } from '../../shared/services/apiClient';
import { CurrentStudentCourses, AllStudentCourses } from '../courses/courses.interface';

//=====================================================
//? Get student courses for current semester
//=====================================================

export const getCurrentStudentCourses = async (): Promise<CurrentStudentCourses> => {
    const response = await apiClient.get(`/api/courses/current`);
    console.log("this is response for /courses/current:", response.data.data);
    return response.data.data;
};

//=====================================================
//? Get all coruses for studnet
//=====================================================

export const getAllStudnetCourses = async (page: number, limit: number): Promise<AllStudentCourses> => {
    const response = await apiClient.get(`/api/courses/student/all?page=${page}&limit=${limit}`);
    console.log("this is response for /courses/student/all:", response.data);
    return response.data.data;
}

//=====================================================
//? Enroll course
//=====================================================
export const enrollStudent = async (offeredCourseId: string): Promise<void> => {
    const response = await apiClient.post(`/api/courses/${offeredCourseId}/enroll`);
    console.log("this is response for /courses/:offeredCourseId/enroll:", response.data);
    return response.data.data;
}