import { createSlice } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiUrl } from './common'
import { persistStore, persistReducer } from 'redux-persist'
import createSS from '../utils/secureStorageWrapper'

export interface User {
    username: string
    email: string
    profilePicture: string
    active: boolean
    roles: Map<string, string>
}

export interface LoginResponse {
    jwt: string
    claim: User
}

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthState {
    loading: boolean
    userInfo: User
    userToken: string
    error: Error | null
    loggedIn: boolean
}

const initialState: AuthState = {
    loading: false,
    userInfo: {} as User,
    userToken: '',
    error: null,
    loggedIn: false,
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${apiUrl}auth`,
    }),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (loginForm: LoginRequest) => ({
                url: '/login',
                method: 'POST',
                body: loginForm,
            })
        })
    }),
})

export const { useLoginMutation } = authApi

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.userToken = ""
            state.loggedIn = false
        },
    },
    extraReducers: builder => {
        builder.addMatcher(
            authApi.endpoints.login.matchFulfilled,
            (state, { payload }) => {
                state.userToken = payload.jwt
                state.userInfo = payload.claim
                state.error = null
                state.loggedIn = true
                state.loading = false
            },
        )
    },
})

export const { logout } = authSlice.actions