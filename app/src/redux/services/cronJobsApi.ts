import { CRONJOBURLS } from "@/redux/api-conf";
import { BASE_URL } from "@/redux/conf";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from '@/redux/store';

export const cronJobsApi = createApi({
    reducerPath: "cronJobsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["CronJobs"],
    endpoints: (builder) => ({
        getAllCronJobs: builder.query<any, any>({
            query: () => ({
                url: CRONJOBURLS.CRON_JOBS,
                method: 'GET',
            }),
            transformResponse: (response: { data: any; }) => response.data,
        })
    }),
});

export const { useGetAllCronJobsQuery } = cronJobsApi;