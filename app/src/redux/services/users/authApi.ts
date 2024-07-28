import { AUTHURLS } from "@/redux/api-conf";
import { BASE_URL } from "@/redux/conf";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["Authentication"],
    endpoints: (builder) => ({
        loginUser: builder.mutation<any, { email?: string, type: string, phone?: string, isIndia?: boolean }>({
            query(credentials) {
                return {
                    url: AUTHURLS.USER_LOGIN,
                    method: 'POST',
                    body: credentials,
                    accept: 'application/json',
                };
            },
            transformResponse: (response: { data: any; }) => response.data,
            invalidatesTags: [{ type: "Authentication", id: "LIST" }],
        }),
        verifyOtp: builder.mutation<any, { email?: string, otp: string, type: string, phone?: string, isIndia?: boolean }>({
            query: ({ email, otp, type, phone, isIndia }) => ({
                url: AUTHURLS.VERIFY_OTP,
                method: 'POST',
                body: { email, otp, type, phone, isIndia: isIndia ?? false },
                accept: 'application/json',
            }),
            transformResponse: (response: { data: any; }) => response.data,
            invalidatesTags: [{ type: "Authentication", id: "LIST" }],
        }),
        getAuthData: builder.query<any, { token: string }>({
            query: ({ token }) => ({
                url: AUTHURLS.GET_AUTH_DATA,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        })
    }),
});

export const {
    useLoginUserMutation,
    useGetAuthDataQuery,
    useVerifyOtpMutation
} = authApi;