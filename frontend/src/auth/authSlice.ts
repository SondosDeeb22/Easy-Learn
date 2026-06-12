//======================================================================
//? import 
//  ======================================================================
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


//======================================================================



export const authSlice = createSlice({
    name: 'auth',

    //--------
    initialState: {
        id: "",
        password: ""
    },

    //--------
    reducers: {
        setId: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        clearId: (state) => {
            state.id = "";
        },

        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
        clearPassword: (state) => {
            state.password = "";
        },
    },
});

//  ======================================================================

// action creators are generated for each reducer function 
export const { setId, clearId, setPassword, clearPassword } = authSlice.actions; // It destructures the generated action creators from authSlice.actions and exports them so they can be imported and dispatched elsewhere in the application.

export default authSlice.reducer; // used in store.ts file, it generate the reducer that update the state
