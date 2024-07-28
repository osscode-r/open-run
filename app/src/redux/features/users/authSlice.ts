import { AUTH_TOKEN, expireCookies, getAuthCookie, removeCookies, setAuthCookie } from "@/lib/cookies";
import { authApi } from "@/redux/services/users/authApi";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


interface AuthState {
    user?: any | null;
    token?: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: () => {
            removeCookies([AUTH_TOKEN]);
            return initialState;
        },
        expireToken: (state, action: PayloadAction<string[]>) => {
            expireCookies(action.payload);
            const token = getAuthCookie(AUTH_TOKEN);
            state.token = token;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                authApi.endpoints.loginUser.matchFulfilled,
                (state, { payload }: { payload: any | null }) => {
                    if (payload) {

                    }
                }
            ).addMatcher(
                authApi.endpoints.verifyOtp.matchFulfilled,
                (state, { payload }) => {
                    if (payload) {
                        setAuthCookie(payload.session.access_token as string, AUTH_TOKEN);
                        state.user = payload;
                        state.token = payload.token;
                    }
                }
            )
            .addMatcher(
                authApi.endpoints.getAuthData.matchFulfilled,
                (state, { payload }) => {
                    if (payload) {
                        state.user = payload;
                        state.token = payload.token;
                    }
                }
            )
    },
});

export const { logout, expireToken } = authSlice.actions;

export default authSlice.reducer;
