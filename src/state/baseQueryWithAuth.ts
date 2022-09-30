import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/dist/query"
import { logout } from "./auth"
import { apiUrl } from "./common"
import { RootState } from "./state"

const baseQuery = fetchBaseQuery({
    baseUrl: apiUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.userToken
        if (token) headers.set('x-access-token', token)
        return headers
    },
})

export const baseQueryWithAuth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 401) {
        api.dispatch(logout())
    }

    return result
}