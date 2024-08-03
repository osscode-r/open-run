import { authApi } from "@/redux/services/users/authApi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
}

const isClient = typeof window !== 'undefined';

const getInitialToken = (): string | null => {
  if (isClient) {
    const token = localStorage.getItem('token');
    console.log('Initial token from localStorage:', token);
    return token;
  }
  return null;
};

const initialState: AuthState = {
  user: null,
  token: getInitialToken(),
  isAuthenticated: isClient ? !!localStorage.getItem('token') : false,
};

const setTokenToStorage = (token: string) => {
  if (isClient && token) {
    try {
      localStorage.setItem('token', token);
      console.log('Token set to localStorage:', token);
    } catch (error) {
      console.error('Failed to save token to localStorage:', error);
    }
  } else {
    console.log('Not setting token to localStorage. isClient:', isClient, 'token:', token);
  }
};

const removeTokenFromStorage = () => {
  if (isClient) {
    try {
      localStorage.removeItem('token');
      console.log('Token removed from localStorage');
    } catch (error) {
      console.error('Failed to remove token from localStorage:', error);
    }
  }
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; token: string }>
    ) => {
      console.log('setCredentials called with payload:', action.payload);
      const { user, token } = action.payload;
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
        setTokenToStorage(token);
      } else {
        console.error('Attempted to set undefined token in setCredentials');
      }
      state.user = user;
      console.log('State after setCredentials:', JSON.parse(JSON.stringify(state)));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeTokenFromStorage();
      console.log('State after logout:', JSON.parse(JSON.stringify(state)));
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => {
        console.log('loginUser.matchFulfilled called with payload:', payload);
        if (payload && payload.token) {
          state.user = payload.user;
          state.token = payload.token;
          state.isAuthenticated = true;
          setTokenToStorage(payload.token);
          console.log('State after loginUser fulfilled:', JSON.parse(JSON.stringify(state)));
        } else {
          console.error('loginUser fulfilled without a valid token');
        }
      }
    );
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;