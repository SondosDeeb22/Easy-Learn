import { apiClient } from '../../shared/services/apiClient';
import { Course, StudentCurrentCourses, OfferedCourses, OfferedCoursesWithCredits } from '../interfaces/courses.interface';

//=====================================================
//? Get student courses for current semester
//=====================================================

export const getStudentCurrentCourses = async (): Promise<StudentCurrentCourses[]> => {
    const response = await apiClient.get('/api/courses/current');
    console.log("this is response for /courses/current:", response.data);
    return response.data.data;
};

//=====================================================
//? Get all coruses for studnet
//=====================================================

export const getStudnetCourses = async (): Promise<Course[]> => {
    const response = await apiClient.get('/api/courses/all');
    console.log("this is response for /courses/all:", response.data);
    return response.data.data;
}

//=====================================================
//? Get offered courses
//=====================================================

export const getOfferedCourses = async (): Promise<OfferedCoursesWithCredits> => {
    const response = await apiClient.get('/api/courses/offered');
    console.log("this is response for /courses/offered:", response.data.data);

    const { remainingCredits, courses } = response.data.data;
    if (!Array.isArray(courses)) {
        throw new Error("Expected courses to be an array");
    }
    return { remainingCredits, courses };
}


//=====================================================
//? Enroll course
//=====================================================
export const enrollStudent = async (offeredCourseId: string): Promise<void> => {
    const response = await apiClient.post(`/api/courses/${offeredCourseId}/enroll`);
    console.log("this is response for /courses/:offeredCourseId/enroll:", response.data);
    return response.data.data;
}