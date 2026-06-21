//============================================
//? Import
//============================================

// Axios Client
import { apiClient } from '../../shared/services/apiClient';

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
        const response = await apiClient.post('/api/auth/login', { id, password });
        const userData = response.data.data;

        dispatch(setUser(userData));
        dispatch(setError(""));



        localStorage.setItem('isLoggedIn', 'true');// localStorage: is a built-in browser API that stores key-value pairs (It survives page refreshes and browser restarts)
        // track if user has logged in before, and only then calls /api/auth/user to restore the session, to avoiding a 401 error in the console

        return userData;
        // ==============================================================
    } catch (error: any) {
        console.log(error);
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(setError(errorMessage));
        throw error;
    }
}


