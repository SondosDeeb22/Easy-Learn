import { apiClient } from '../../shared/services/apiClient';
import { StudentData } from '../interfaces/users.interface';


// ==================================================================
//? Get student data
// ==================================================================

export const getUserData = async (studentId: string): Promise<StudentData> => {

    const response = await apiClient.get(`/api/users/${studentId}`);

    if (!response.data.data) throw new Error("No user data returned from /api/users/:studentId:");
    const { id, name, role, birthDate, gender, email, currentSemesterCredit, totalCredit, maxCredits } = response.data.data;

    console.log("this is response for /users/:studentId:", response.data.data);
    return { id, name, role, birthDate, gender, email, currentSemesterCredit, totalCredit, maxCredits };
}
