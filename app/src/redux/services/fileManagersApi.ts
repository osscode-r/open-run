import { FILEMANAGERURLS } from "@/redux/api-conf";
import { BASE_URL } from "@/redux/conf";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from '@/redux/store';
import { CreateDirectoryResponse, FileListResponse } from "@/app/file-manager/types";

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
        createDirectory: builder.mutation<CreateDirectoryResponse, { path: string, name: string }>({
            query: ({ path, name }) => ({
                url: FILEMANAGERURLS.CREATE_DIRECTORY,
                method: 'POST',
                body: { path, name }
            }),
            transformResponse: (response: CreateDirectoryResponse) => response,
        }),
        deleteDirectory: builder.mutation<CreateDirectoryResponse, { path: string }>({
            query: ({ path }) => ({
                url: FILEMANAGERURLS.DELETE_DIRECTORY,
                method: 'DELETE',
                body: { path }
            }),
            transformResponse: (response: CreateDirectoryResponse) => response,
        }),
        deleteFile: builder.mutation<CreateDirectoryResponse, { path: string }>({
            query: ({ path }) => ({
                url: FILEMANAGERURLS.DELETE_FILE,
                method: 'DELETE',
                body: { path }
            }),
            transformResponse: (response: CreateDirectoryResponse) => response,
        }),
        renameFile: builder.mutation<CreateDirectoryResponse, { path: string, name: string }>({
            query: ({ path, name }) => ({
                url: FILEMANAGERURLS.RENAME_FILE,
                method: 'POST',
                body: { path, name }
            }),
            transformResponse: (response: CreateDirectoryResponse) => response,
        }),
        renameDirectory: builder.mutation<CreateDirectoryResponse, { path: string, name: string }>({
            query: ({ path, name }) => ({
                url: FILEMANAGERURLS.RENAME_DIRECTORY,
                method: 'POST',
                body: { path, name }
            }),
            transformResponse: (response: CreateDirectoryResponse) => response,
        }),
        createFile: builder.mutation<CreateDirectoryResponse, { path: string, name: string }>({
            query: ({ path, name }) => ({
                url: FILEMANAGERURLS.CREATE_FILE,
                method: 'POST',
                body: { path, name }
            }),
            transformResponse: (response: CreateDirectoryResponse) => response,
        }),
    }),
});

export const {
    useGetFilesInPathQuery,
    useCreateDirectoryMutation,
    useDeleteDirectoryMutation,
    useDeleteFileMutation,
    useRenameFileMutation,
    useRenameDirectoryMutation,
    useCreateFileMutation
} = fileManagersApi;