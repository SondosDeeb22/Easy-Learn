import { apiClient } from "../../shared/services/apiClient";
import { StudentFilterParams, User, Student, Students } from "../interfaces/users.interface";





// ==================================================================
//? Get user data
// ==================================================================

export const getUserData = async (studentId: string): Promise<User> => {

    const response = await apiClient.get(`/api/users/${studentId}`);

    if (!response.data.data) throw new Error("No user data returned from /api/users/student/:studentId:");
    const { id, name, role, gender, email, currentSemesterCredits, totalCredits } = response.data.data;

    console.log("this is response for /users/student/:studentId:", response.data.data);
    return { id, name, role, gender, email, currentSemesterCredits, totalCredits };
}


// ==================================================================================================
//? Get students data according to filters
// ==================================================================================================

export const getFilteredStudents = async (params: { page: number; limit: number } & StudentFilterParams): Promise<Students> => {
    const { page, limit, ...filters } = params;
    const response = await apiClient.get(`/api/users/students?page=${page}&limit=${limit}`, { params: { ...filters } });

    return response.data.data;
}

// ==================================================================================================
//? Get student data for admin view
// ==================================================================================================
export const getStudentForAdmin = async (studentId: string): Promise<Student> => {

    const response = await apiClient.get(`/api/users/${studentId}`);

    return response.data.data;
}