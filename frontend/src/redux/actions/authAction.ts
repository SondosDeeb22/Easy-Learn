//============================================
//? Import
//============================================

// Axios Client
import { apiClient } from '../../services/apiClient';

// import reducers from slices
import { Dispatch } from '@reduxjs/toolkit';
import { setUser, setError, clearError } from '../slices/authSlice';


// login credentials
interface LoginCredentials {
    id: string;
    password: string;
}
//==========================================

export const login = ({ id, password }: LoginCredentials) => async (dispatch: Dispatch) => {
    try {
        const response = await apiClient.post('/auth/login', { id, password });
        const userData = response.data.data;

        if (userData && userData.role !== 'admin') {
            await apiClient.post('/auth/logout', {});
            throw new Error("Sorry, you are not authorized to perform this action!");
        }

        dispatch(setUser(userData));
        dispatch(setError(""));

        // ==============================================================
    } catch (error: any) {
        console.log(error);
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(setError(errorMessage));
        throw error;
    }
}


