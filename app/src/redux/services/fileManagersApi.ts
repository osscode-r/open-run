import { FILEMANAGERURLS } from "@/redux/api-conf";
import { BASE_URL } from "@/redux/conf";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from '@/redux/store';
import { FileListResponse } from "@/app/file-manager/types";

export const fileManagersApi = createApi({
    reducerPath: "fileManagersApi",
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
    tagTypes: ["FileManagers"],
    endpoints: (builder) => ({
        getFilesInPath: builder.query<FileListResponse['data'], { path: string }>({
            query: ({ path }) => ({
                url: FILEMANAGERURLS.LIST_FILES_AT_PATH + "?path=" + path,
                method: 'GET',
            }),
            transformResponse: (response: FileListResponse) => response.data,
        }),
    }),
});

export const {
    useGetFilesInPathQuery
} = fileManagersApi;