
import { apiClient } from '../../shared/services/apiClient';
import { Course, Semester, CourseFilterParams, CreateCourseData } from '../courses/courses.interface';
// interfaces
import { CurrentStudentCourses, WithdrawStudentCourse, AllCourses } from "../courses/courses.interface";

//=====================================================
//? Get filtered courses
//=====================================================
export const getCourses = async (filters: CourseFilterParams, page: number, limit: number): Promise<AllCourses> => {
  const params = new URLSearchParams();
  if (filters.code) params.append('code', filters.code);
  if (filters.title) params.append('title', filters.title);
  if (filters.status) params.append('status', filters.status);

  console.log(JSON.stringify(params))
  const response = await apiClient.get(`/api/courses?${params.toString()}&page=${page}&limit=${limit}`);
  console.log(`Response for /api/courses`, response.data.data);
  return response.data.data;
}

//=====================================================
//? Create a new course
//=====================================================
export const createCourse = async (data: CreateCourseData): Promise<Course> => {
  try {
    console.log(`[frontend/courses.service] provided data:\n ${JSON.stringify(data)}`);
    const response = await apiClient.post(`/api/courses/add`, data);
    console.log(`Response for POST /api/courses/add`, response.data);
    return response.data.data;
  } catch (error: any) {
    console.log(`Error [createCourse]:`, error.message)
    throw new Error(error.response?.data?.message || "Failed to create course")
  }
}


//=====================================================
//? Get a specific student's current semester courses (admin)
//=====================================================

export const getStudentCurrentCoursesForAdmin = async (
  studentId: string,
): Promise<CurrentStudentCourses> => {
  // For now we reuse the existing endpoint logic; the backend will filter by studentId.
  const response = await apiClient.get(
    `/api/courses/current?studentId=${studentId}`
  );
  console.log(`Response for /api/courses/current?studentId=${studentId}`, response.data);
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
//? Enroll student in a course
//=====================================================
export const enrollStudent = async (offeredCourseId: string, studentId: string): Promise<void> => {
  try {
    const response = await apiClient.post(`/api/courses/${offeredCourseId}/enroll?studentId=${studentId}`);
    console.log("this is response for /courses/:offeredCourseId/enroll:", response.data);
    return response.data.data;

  } catch (error: any) {
    console.log(`Error [enrollStudent]:`, error)
    throw new Error(error.response?.data?.message || "Failed to enroll student in course")
  }
}

//=====================================================
//? Withdraw a student from course 
//=====================================================

export const withdrawStudentFromCourse = async ({
  studentId,
  courseId,
}: WithdrawStudentCourse): Promise<void> => {

  try {
    const response = await apiClient.delete(
      `/api/courses/withdraw/${studentId}/${courseId}`,
    );
    return response.data.data;
  } catch (error: any) {
    console.log(`Error [withdrawStudentCourse]:`, error)
    throw new Error(error.response?.data?.message || "Failed to withdraw from course")
  }

};

//=====================================================
//? Update a course
//=====================================================
export const updateCourse = async (data: Course): Promise<any> => {
  try {
    console.log(`[frontend/courses.service] update data:\n ${JSON.stringify(data)}`);
    const response = await apiClient.patch(`/api/courses/update`, data);
    console.log(`Response for PATCH /api/courses/update`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`Error [updateCourse]:`, error.message)
    throw new Error(error.response?.data?.message || "Failed to update course")
  }
}

