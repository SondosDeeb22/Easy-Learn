
import { apiClient } from '../../shared/services/apiClient';
import { Course, Semester } from '../interfaces/courses.interface';
//=====================================================
//? get all Courses
//=====================================================

export const getAllCourses = async (): Promise<Course[]> => {
    const response = await apiClient.get(`/api/courses/all`);
    console.log("this is response for /courses/all", response.data);
    return response.data.data;
}

//=====================================================
//? get all semesters
//=====================================================

export const getAllSemesters = async (): Promise<Semester[]> => {
    const response = await apiClient.get(`/api/courses/semesters`);
    console.log("this is response for /courses/semesters:", response.data);
    return response.data.data;
}