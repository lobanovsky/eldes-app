/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginData } from 'utils/types';

export const EMPTY_USER: LoginData = {
    token: '',
    loginPassword: '',
    user: {
        id: 0,
        email: '',
        phoneNumber: '',
        registrationDate: '',
        isActive: false
    }
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
        loginPasswordGenerated: (state: AuthStoreState,{ payload }: PayloadAction<string>) => {
            state.user.loginPassword = payload;
            state.isCheckingToken = false;
        },
    }
});

export const {
    loginStarted,
    loginSuccess,
    loginError,
    logout,
    loginPasswordGenerated
} = authSlice.actions;

// @ts-ignore
export default authSlice.reducer;
