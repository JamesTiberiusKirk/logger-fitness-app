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
    workout: Workout
    exercises: Exercise[]
}

export interface WorkoutsState {
    workouts: WorkoutResponse[] | null
}

const initialWorkoutState: WorkoutsState = {
    workouts: null
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
            workoutsApi.endpoints.workouts.matchFulfilled,
            (state, { payload }) => {
                state.workouts = payload
            },
        )
    },
})