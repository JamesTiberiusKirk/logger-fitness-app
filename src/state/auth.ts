import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import * as SecureStore from "expo-secure-store";
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
        }),
    }),
})

export const { useLoginMutation } = authApi

export const authStateKey = "AUTH"
export const hydrateUserFromSS = createAsyncThunk(
    'auth/hydrateUserFromSS',
    async (_, thunkApi) => {
        const rawAuthState = await SecureStore.getItemAsync(authStateKey);
        if (rawAuthState) {
            const authState = JSON.parse(rawAuthState)
            // TODO: should also see if i can revalidate the token
            //  need to figure out how to do another api call from here
            return { found: true, authState }
        }
        return { found: false, authState: {} as AuthState }
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.userToken = ""
            state.loggedIn = false
            state.userInfo = {} as User
        },
    },
    extraReducers: builder => {
        builder.addCase(
            hydrateUserFromSS.fulfilled,
            (state, { payload }) => {
                if (payload.found) {
                    state.error = null
                    state.loading = false
                    state.loggedIn = true
                    state.userInfo = payload.authState.userInfo
                    state.userToken = payload.authState.userToken
                } else {
                    state.userToken = ""
                    state.userInfo = {} as User
                    state.loggedIn = false
                }
            },
        )
        builder.addMatcher(
            authApi.endpoints.login.matchFulfilled,
            (state, { payload }) => {
                state.userToken = payload.jwt
                state.userInfo = payload.claim
                state.error = null
                state.loggedIn = true
                state.loading = false
                SecureStore.setItemAsync(authStateKey, JSON.stringify(state))
            },
        )
    },
})

export const { logout } = authSlice.actions