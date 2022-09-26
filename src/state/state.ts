import { configureStore } from '@reduxjs/toolkit'
import { authApi, authSlice } from './auth'

export const store = configureStore({
    reducer: {
        'auth': authSlice.reducer,
        [authApi.reducerPath]: authApi.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().
            concat(authApi.middleware)
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch