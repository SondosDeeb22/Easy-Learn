import { apiClient } from '../../shared/services/apiClient';
import { StudentData } from './studentData.interface';

// ====================================================================
//? Get student GPA
// ========================================================================
export const getCurrentStudentGPA = async (studentId: string, semesterId: string): Promise<number> => {
    const response = await apiClient.get(`/api/users/gpa/${studentId}/${semesterId}`);
    if (!response.data.data) {
        console.log(`[getCurrentStudentGPA] No GPA data returned from /api/users/gpa/${studentId}/${semesterId}:`, response.data.data);
        // throw new Error("No GPA data returned");
    }
    const gpa = response.data.data;
    console.log("this is response for /users/gpa/:studentId/:semesterId:", gpa);
    return gpa;
}

