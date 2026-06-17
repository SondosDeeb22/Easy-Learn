import { apiClient } from '../../shared/services/apiClient';
import { Course, CurrentSemesterCourses } from '../interfaces/course.interface';



//=====================================================
//? Get student courses for current semester
//=====================================================

export const getCurrentSemesterCourses = async (): Promise<CurrentSemesterCourses[]> => {
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