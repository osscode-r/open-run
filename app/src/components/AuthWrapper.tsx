"use client"

import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux';
import { getValidAuthTokens } from '@/lib/cookies';
import Loading from './Loading';
import { useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { useGetAuthDataQuery } from '@/redux/services/users/authApi';
import { logout } from '@/redux/features/users/authSlice';
import ErrorHandler from './ErrorHandler';

type Props = {
    children: React.ReactNode;
};

export const AuthWrapper = ({ children }: Props) => {
    const dispatch = useDispatch();
    const { push } = useRouter();
    const user = useAppSelector((state) => state.authState.user);
    const { token } = getValidAuthTokens();
    const { error, isLoading } = useGetAuthDataQuery(
        { token: token || '' },
        { skip: !!user?.email || !token }
    );

    useEffect(() => {
        if (!token && !user) {
            push('/login');
            dispatch(logout());
        }
    }, [token, user, push, dispatch]);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        <ErrorHandler error={JSON.stringify(error)} title="Authentication Error" />
    }

    return children;
};