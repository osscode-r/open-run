import { AUTHURLS } from "@/redux/api-conf";
import { BASE_URL } from "@/redux/conf";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["Authentication"],
    endpoints: (builder) => ({
        loginUser: builder.mutation<any, { username_or_email: string, password: string }>({
            query(credentials) {
                return {
                    url: AUTHURLS.USER_LOGIN,
                    method: 'POST',
                    body: credentials,
                };
            },
            transformResponse: (response: { data: any; token: string }) => { return { ...response.data, token: response.token } },
            invalidatesTags: [{ type: "Authentication", id: "LIST" }],
        })
    }),
});

export const {
    useLoginUserMutation
} = authApi;