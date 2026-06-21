import { apiClient } from '../../shared/services/apiClient';
import { CurrentStudentCourses, CourseWithGrade, OfferedCoursesWithCredits, AllStudentCourses } from '../interfaces/courses.interface';

//=====================================================
//? Get student courses for current semester
//=====================================================

export const getCurrentStudentCourses = async (page: number, limit: number): Promise<CurrentStudentCourses> => {
    const response = await apiClient.get(`/api/courses/current?page=${page}&limit=${limit}`);
    console.log("this is response for /courses/current:", response.data);
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
//? Get offered courses
//=====================================================

export const getAvailableCoursesForStudent = async (page: number, limit: number): Promise<OfferedCoursesWithCredits> => {
    const response = await apiClient.get(`/api/courses/offered?page=${page}&limit=${limit}`);
    console.log(`this is response for /courses/offered?page=${page}&limit=${limit}`, response.data.data);

    const { remainingCredits, courses, totalRows } = response.data.data;
    if (!Array.isArray(courses)) {
        throw new Error("Expected courses to be an array");
    }
    return { remainingCredits, courses, totalRows };
}


//=====================================================
//? Enroll course
//=====================================================
export const enrollStudent = async (offeredCourseId: string): Promise<void> => {
    const response = await apiClient.post(`/api/courses/${offeredCourseId}/enroll`);
    console.log("this is response for /courses/:offeredCourseId/enroll:", response.data);
    return response.data.data;
}