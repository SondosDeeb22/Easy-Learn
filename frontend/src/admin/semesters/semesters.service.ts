import { apiClient } from '../../shared/services/apiClient';
import { Semester, GetSemestersParam, GetSemestersResult } from '../semesters/semesters.interface';

//=====================================================
//? get all semesters
//=====================================================
export const getAllSemesters = async (params?: GetSemestersParam): Promise<GetSemestersResult> => {
    const response = await apiClient.get(`/api/semesters/all`, { params });
    console.log(`[frontend/service/semester - /semesters/all] response: `, response.data.data);
    return response.data.data;
};

//=====================================================
//? get current active semester
//=====================================================
export const getCurrentSemester = async (): Promise<Semester | null> => {

    const response = await apiClient.get(`/api/semesters/current`);
    console.log(`[frontend/service/semester - /semesters/current] response: `, response.data);
    return response.data.data;
};

//=====================================================
//? create a new semester
//=====================================================
export const createSemester = async (data: Semester): Promise<{ message: string, data: null }> => {
    const response = await apiClient.post(`/api/semesters/add`, data);
    console.log(`[frontend/service/semester - /semesters/add] response: `, response.data);
    return response.data;
};

//=====================================================
//? update an existing semester
//=====================================================
export const updateSemester = async (data: Semester): Promise<{ message: string, data: boolean }> => {
    const response = await apiClient.patch(`/api/semesters/update`, data);
    console.log(`[frontend/service/semester - /semesters/update] response: `, response.data);
    return response.data;
};