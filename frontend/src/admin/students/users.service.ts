import { apiClient } from "../../shared/services/apiClient";
import { StudentFilterParams, User, Student, Students } from "../students/users.interface";


// ==================================================================================================
//? Get students data according to filters
// ==================================================================================================

export const getFilteredStudents = async (params: { page?: number; limit?: number } & StudentFilterParams): Promise<Students> => {
    const { page, limit, ...filters } = params;
    const queryParams = new URLSearchParams();
    if (page !== undefined) queryParams.append('page', String(page));
    if (limit !== undefined) queryParams.append('limit', String(limit));
    const response = await apiClient.get(`/api/users/students?${queryParams.toString()}`, { params: { ...filters } });

    return response.data.data;
}

// ==================================================================================================
//? Get student data for admin view
// ==================================================================================================
export const getStudentForAdmin = async (studentId: string): Promise<Student> => {

    const response = await apiClient.get(`/api/users/${studentId}`);

    return response.data.data;
}