import { apiClient } from "../../shared/services/apiClient";
import { StudentFilterParams, Student, Students } from "../interfaces/users.interface";


export const getStudents = async (page: number, limit: number, filters?: StudentFilterParams): Promise<Students> => {

    const response = await apiClient.get(`/api/users/students?page=${page}&limit=${limit}`, { params: { ...filters } });

    return response.data.data;

}

// ==================================================================================================
//? Get student data for admin view
// ==================================================================================================
export const getStudentForAdmin = async (studentId: string): Promise<Student> => {

    const response = await apiClient.get(`/api/users/admin/student/${studentId}`);

    return response.data.data;
}