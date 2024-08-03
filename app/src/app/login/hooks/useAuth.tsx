import {  useDispatch } from "react-redux";
import { useLoginUserMutation } from "@/redux/services/users/authApi";
import { setCredentials, logout } from "@/redux/features/users/authSlice";
import { useAppSelector } from "@/redux/hooks";

export const useAuth = () => {
    const dispatch = useDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const token = useAppSelector((state) => state.auth.token);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const [loginUser] = useLoginUserMutation();

    const login = async (username_or_email: string, password: string) => {
        try {
            const result = await loginUser({ username_or_email, password }).unwrap();
            dispatch(setCredentials({ user: result.user, token: result.token }));
            return result;
        } catch (error) {
            console.error("Failed to login:", error);
            throw error;
        }
    };

    const logoutUser = () => {
        dispatch(logout());
    };

    return { user, token, isAuthenticated, login, logout: logoutUser };
};