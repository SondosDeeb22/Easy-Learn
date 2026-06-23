import { apiClient } from '../../shared/services/apiClient';
import { Semester } from '../interfaces/semesters.interface';
//=====================================================
//? get all semesters
//=====================================================

export const getAllSemesters = async (): Promise<Semester[]> => {
    const response = await apiClient.get(`/api/semesters/all`);
    console.log("this is response for /semesters/all", response.data);
    return response.data.data;
};