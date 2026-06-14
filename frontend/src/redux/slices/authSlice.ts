//======================================================================
//? import 
//  ======================================================================
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


//======================================================================

interface AuthErrors {
    id?: string;
    password?: string;
    general?: string;
}

const initialState = {
    userId: "",
    userRole: "",
    userEmail: "",
    isAuthenticated: false,

    isLoading: false,
    errors: {} as AuthErrors,
}


export const authSlice = createSlice({
    name: 'auth',

    //--------
    initialState,

    //--------
    reducers: {

        // user << ----------------------------------------------
        setUser: (state, action) => {
            state.userId = action.payload?.id || "";
            state.userRole = action.payload?.role || "";
            state.userEmail = action.payload?.email || "";

            state.isAuthenticated = true;
            state.isLoading = false;
            state.errors = {};
        },

        clearUser: (state) => {
            state.userId = "";
            state.userRole = "";
            state.userEmail = "";

            state.isAuthenticated = false;
            state.isLoading = false;
            state.errors = {};
        },

        // Loading <<< ----------------------------------- 
        startLoading: (state) => {
            state.isLoading = true
        },

        stopLoading: (state) => {
            state.isLoading = false
        },

        // Errors <<< ----------------------------------
        setError: (state, action: PayloadAction<AuthErrors | string>) => {
            if (typeof action.payload === 'string') {
                state.errors = { general: action.payload };
            } else {
                state.errors = { ...state.errors, ...action.payload };
            }
        },


        clearError: (state) => {
            state.errors = {};
        },

        clearSpecificError: (state, action: PayloadAction<keyof AuthErrors>) => {
            if (state.errors) {
                delete state.errors[action.payload];
            }
        },
    },
});

//  ======================================================================

// action creators are generated for each reducer function 
export const { setUser, clearUser, startLoading, stopLoading, setError, clearError, clearSpecificError } = authSlice.actions; // It destructures the generated action creators from authSlice.actions and exports them so they can be imported and dispatched elsewhere in the application

export default authSlice.reducer; // used in reduxConfig.ts file, it generate the reducer that update the state
