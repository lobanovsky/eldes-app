/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {LoginData, UserInfo} from 'utils/types';

export const EMPTY_USER_DATA: UserInfo = {
    id: 0,
    email: '',
    phoneNumber: '',
    registrationDate: '',
    isActive: false
}
export const EMPTY_USER: LoginData = {
    token: '',
    loginPassword: '',
    user: {...EMPTY_USER_DATA}
};

export interface AuthStoreState {
    user: LoginData,
    isCheckingToken: boolean,
    isLoadingUser: boolean,
    isLoggingIn: boolean,
    isUserLoggedIn: boolean,
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: EMPTY_USER,
        workspaceId: null,
        workspaceName: '',
        isCheckingToken: true,
        isLoadingUser: false,
        isLoggingIn: false,
        isUserLoggedIn: false
    },
    reducers: {
        loginStarted: (state: AuthStoreState) => {
            state.isLoggingIn = true;
            state.isCheckingToken = true;
        },
        loginSuccess: (state: AuthStoreState, { payload }: PayloadAction<LoginData>) => {
            state.isLoggingIn = false;
            state.isUserLoggedIn = true;
            state.isCheckingToken = false;
            state.user = payload;
        },
        loginError: (state: AuthStoreState) => {
            state.isLoggingIn = false;
            state.isUserLoggedIn = false;
            state.isCheckingToken = false;
        },
        logout: (state: AuthStoreState) => {
            state.isUserLoggedIn = false;
            state.isCheckingToken = false;
            state.user = EMPTY_USER;
        },
        loginPasswordGenerated: (state: AuthStoreState,{ payload }: PayloadAction<{password: string, email: string}>) => {
            state.user.loginPassword = payload.password;
            state.user.loginEmail = payload.email;
            state.isCheckingToken = false;
        },
        platformChanged: (state: AuthStoreState,{ payload }: PayloadAction<string>) => {
            state.user.platform = payload;
        },
    }
});

export const {
    loginStarted,
    loginSuccess,
    loginError,
    logout,
    loginPasswordGenerated,
    platformChanged
} = authSlice.actions;

// @ts-ignore
export default authSlice.reducer;
