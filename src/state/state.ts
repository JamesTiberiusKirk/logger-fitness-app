import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import { authApi, authSlice } from './auth'
import { workoutsApi, workoutsSlice } from './workouts'

export const store = configureStore({
    reducer: {
        'auth': authSlice.reducer,
        'workouts': workoutsSlice.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [workoutsApi.reducerPath]: workoutsApi.reducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().
            concat(authApi.middleware).
            concat(workoutsApi.middleware)
    }
})

// TYPES
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// HOOKS
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector