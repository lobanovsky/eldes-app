import React, {useCallback, useState} from 'react';
import {SharedProps, SnackbarKey, useSnackbar} from "notistack";
import CloseIcon from '@mui/icons-material/Close';
import {ServerError} from "../utils/types";
import {IconButton} from "@mui/material";

export const getErrorMessage = (defaultMsg: string, axiosError?: ServerError) => {
    const errorMsg = axiosError?.response?.data || axiosError?.message || axiosError?.error || axiosError?.response || '';
    return <div>
        <div>{defaultMsg}{!defaultMsg.endsWith('.') ? '.' : ''}<br/><br/></div>
        <div>{typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}</div>
    </div>
}

type SuccessNotificationFn = (msg: string | React.ReactNode, options?: SharedProps<'success'>) => void;
type ErrorNotificationFn = (msg: string, serverError?: ServerError | null, options?: SharedProps<'error'>) => void;

export interface NotificationsHookResult {
    showMessage: SuccessNotificationFn;
    showError: ErrorNotificationFn;
}

export function useNotifications(): NotificationsHookResult {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const notificationActions = (snackbarId: SnackbarKey) => (
        <IconButton
            style={{color: 'white'}}
            onClick={() => {
                closeSnackbar(snackbarId);
            }}>
            <CloseIcon/>
        </IconButton>
    );

    const showMessage = useCallback<SuccessNotificationFn>((msg, options = {}) => {
        enqueueSnackbar(msg, {variant: 'success', action: notificationActions, ...options});
    }, []);

    const showError = useCallback<ErrorNotificationFn>((msg, serverError = null, options = {}) => {
        const displayMessage = serverError ? getErrorMessage(msg, serverError) : msg;
        enqueueSnackbar(displayMessage, {variant: 'error', action: notificationActions, ...options});
    }, []);

    return {showMessage, showError};
}
