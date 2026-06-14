// ============================================
//? import 
// ============================================

import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './reduxConfig'
// RootState: it represent Redux State (how redux store look like)
// AppDispatch: represent the Appliation Dispatch function (functions we could dispatch)

// Typed Redux hooks ---------------------
// this provides normalized version of "useDIspatch" and "useSelector", so we reduce duplication evertime we are read from or dispatch redux state
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
