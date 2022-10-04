import { createSlice } from "@reduxjs/toolkit"
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from "./baseQueryWithAuth"

export interface Exercise {

}

export interface Workout {
    id: string
    userId: string
    startTime: string
    notes: string
    title: string
}

export interface WorkoutResponse {
    key: string
    workout: Workout
    exercises: Exercise[]
}

export interface WorkoutsState {
    workouts: WorkoutResponse[]
    status: "pending" | "idle" | "error"
    error: Error | null
}

const initialWorkoutState: WorkoutsState = {
    workouts: [],
    status: "idle",
    error: null,
}

export const workoutsApi = createApi({
    reducerPath: 'workoutsApi',
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        workouts: builder.query<WorkoutResponse[], void>({
            query: () => ({
                url: 'workouts',
                method: 'GET',
            }),
            transformResponse: (result: WorkoutResponse[]): WorkoutResponse[] => {
                return result.map((w, i) => ({
                    key: i.toString(),
                    workout: w.workout,
                    exercises: w.exercises
                } as WorkoutResponse))
            }
        }),
        startWorkout: builder.mutation<any, Workout>({
            query: (workout: Workout) => ({
                url: 'workouts/start',
                method: 'POST',
                body: workout,
            })
        }),
        stopWorkout: builder.mutation<any, string>({
            query: (endTime: string) => ({
                url: 'workouts/stop',
                method: 'POST',
                // params:
            }),
        })
    }),
})
export const {
    useWorkoutsQuery,
    useStartWorkoutMutation,
    useStopWorkoutMutation,
} = workoutsApi

export const workoutsSlice = createSlice({
    name: 'workouts',
    initialState: initialWorkoutState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            workoutsApi.endpoints.workouts.matchPending,
            (state, { payload }) => {
                state.status = "pending"
            }
        )
        builder.addMatcher(
            workoutsApi.endpoints.workouts.matchRejected,
            (state, { payload }) => {
                state.status = "error"
            }
        )
        builder.addMatcher(
            workoutsApi.endpoints.workouts.matchFulfilled,
            (state, { payload }) => {
                state.status = "idle"
                state.error = null
                state.workouts = payload
            },
        )
    },
})