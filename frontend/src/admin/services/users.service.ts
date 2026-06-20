import { apiClient } from "../../shared/services/apiClient";
import { filterdStudentInterface, StudentFilterParams } from "../interfaces/users.interface";


export const getStudents = async (filters?: StudentFilterParams): Promise<filterdStudentInterface | filterdStudentInterface[] | null> => {

    const response = await apiClient.get(`/api/users/students`, { params: filters });

    return response.data.data;

}