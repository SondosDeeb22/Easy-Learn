import { apiClient } from "../../shared/services/apiClient";
import { UserData } from "../interfaces/user.interface";

// ==================================================================
//? Get user data
// ==================================================================

export const getUserData = async (studentId: string): Promise<UserData> => {

    const response = await apiClient.get(`/api/users/${studentId}`);
    return response.data.data;
}
