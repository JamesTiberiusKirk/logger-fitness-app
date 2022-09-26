import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import axios from 'axios'
import { apiUrl } from './common'

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
    userInfo: {} as User, // for user object
    userToken: '', // for storing the JWT
    error: null,
    loggedIn: false, // for monitoring the registration process.
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${apiUrl}`,
    }),
    endpoints(builder) {
        return {
            login: builder.mutation<LoginResponse, LoginRequest>({
                query: (loginForm: LoginRequest) => ({
                    url: 'auth/login',
                    method: 'POST',
                    body: loginForm,
                })
            })
        }
    }
})

export const { useLoginMutation } = authApi

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
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
