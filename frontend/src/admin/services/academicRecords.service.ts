import { apiClient } from '../../shared/services/apiClient';



export const updateStudentGrade = async (payload: { academicRecordId: string; numericGrade: number }) => {
    const response = await apiClient.patch(`/api/academic-records/student/update-grade`, { id: payload.academicRecordId, numericGrade: payload.numericGrade });
    console.log(`update Student Grade response`, response.data);
    return response.data;
}
