import { apiClient } from '../../shared/services/apiClient';



export const updateStudentGrade = async (payload: { academicRecordId: string; grade: string }) => {
    const response = await apiClient.patch(`/api/academic-records/student/update-grade`, { id: payload.academicRecordId, grade: payload.grade });
    console.log(`update Student Grade response`, response.data);
    return response.data.data;
}
