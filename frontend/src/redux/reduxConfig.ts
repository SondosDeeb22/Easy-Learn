// ============================================
//? import 
// ============================================
import { configureStore } from '@reduxjs/toolkit'

import authReducer from './slices/authSlice';

// ============================================

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
})

export default store;

//========================================================================================
// Export types derived from the store so they can be used across the whole app
//=======================================================================================

// Infer the `RootState` and `AppDispatch` types from the store itself
// RootState = the shape of the entire Redux state tree
export type RootState = ReturnType<typeof store.getState>


// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// AppDispatch = the type of the store's dispatch function
export type AppDispatch = typeof store.dispatch