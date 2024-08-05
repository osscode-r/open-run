import { CRONJOBURLS } from "@/redux/api-conf";
import { BASE_URL } from "@/redux/conf";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from '@/redux/store';
import { CronJobListResponse, CronJobResponse, UpdateCronJobRequest } from "@/app/cron-jobs/types";

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
        getAllCronJobs: builder.query<CronJobListResponse['data'], any>({
            query: () => ({
                url: CRONJOBURLS.CRON_JOBS,
                method: 'GET',
            }),
            transformResponse: (response: CronJobListResponse) => response.data,
        }),
        getCronJobById: builder.query<CronJobResponse['data'], string>({
            query: (id) => ({
                url: CRONJOBURLS.CRON_JOBS + `/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: CronJobResponse) => response.data,
        }),
        updateCronJobById: builder.mutation<CronJobResponse['data'], UpdateCronJobRequest>({
            query: (data) => ({
                url: CRONJOBURLS.CRON_JOBS + `/${data.id}`,
                method: 'PUT',
                body: data,
            }),
            transformResponse: (response: CronJobResponse) => response.data,
        }),
        deleteCronJobById: builder.mutation<CronJobResponse['data'], string>({
            query: (id) => ({
                url: CRONJOBURLS.CRON_JOBS + `/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response: CronJobResponse) => response.data,
        }),
        createCronJob: builder.mutation<CronJobResponse['data'], any>({
            query: (data) => ({
                url: CRONJOBURLS.CRON_JOBS,
                method: 'POST',
                body: data,
            }),
            transformResponse: (response: CronJobResponse) => response.data,
        }),
    }),
});

export const {
    useGetAllCronJobsQuery,
    useGetCronJobByIdQuery,
    useUpdateCronJobByIdMutation,
    useDeleteCronJobByIdMutation,
    useCreateCronJobMutation
} = cronJobsApi;