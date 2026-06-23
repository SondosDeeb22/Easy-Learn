import { apiClient } from '../../shared/services/apiClient';
import { StudentData } from '../interfaces/users.interface';


// ==================================================================
//? Get student data
// ==================================================================

export const getStudentData = async (studentId: string): Promise<StudentData> => {

    const response = await apiClient.get(`/api/users/student/${studentId}`);

    if (!response.data.data) throw new Error("No user data returned from /api/users/student/:studentId:");
    const { id, name, role, birthDate, gender, email, currentSemesterCredits, totalCredits, maxCredits } = response.data.data;

    console.log("this is response for /users/student/:studentId:", response.data.data);
    return { id, name, role, birthDate, gender, email, currentSemesterCredits, totalCredits, maxCredits };
}
