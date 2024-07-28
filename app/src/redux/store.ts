import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/users/authSlice";
import { authApi } from "./services/users/authApi";

export const store = configureStore({
    reducer: {
        authState: authReducer,
        [authApi.reducerPath]: authApi.reducer
    },
    devTools: process.env.NODE_ENV !== "production",

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat([
        authApi.middleware
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
