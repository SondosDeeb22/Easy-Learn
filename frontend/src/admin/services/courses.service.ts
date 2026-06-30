
import { apiClient } from '../../shared/services/apiClient';
import { Course, Semester } from '../interfaces/courses.interface';
// interfaces
import { CurrentStudentCourses, WithdrawStudentCourse } from "../interfaces/courses.interface";


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


