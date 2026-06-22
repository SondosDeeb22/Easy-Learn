
import { apiClient } from '../../shared/services/apiClient';
import { Course, Semester } from '../interfaces/courses.interface';
// interfaces
import { CurrentStudentCourses } from "../interfaces/courses.interface";


//=====================================================
//? Get a specific student's current semester courses (admin)
//=====================================================

export const getStudentCurrentCoursesForAdmin = async (
  studentId: string,
): Promise<CurrentStudentCourses> => {
  // For now we reuse the existing endpoint logic; the backend will filter by studentId.
  const response = await apiClient.get(
    `/api/courses/current/${studentId}`
  );
  console.log(`Response for /api/courses/current/${studentId}`, response.data);
  return response.data.data;
}



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
  console.log("this is response for /courses/semesters", response.data);
  return response.data.data;
};

