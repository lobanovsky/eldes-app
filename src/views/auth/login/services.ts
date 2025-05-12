import axios from "axios";
import {Dispatch} from "@reduxjs/toolkit";
import {ErrorNotificationFn} from "hooks/use-notifications";
import {loginError, loginStarted} from "store/auth/reducer";
import {Credentials} from "utils/types";
import {onSuccessLoadUser} from "./helpers";


export const performLogin = (credentials: Credentials, dispatch: Dispatch<any>, showError: ErrorNotificationFn, onFinish?: (isSuccess: boolean) => void) => {
    dispatch(loginStarted());
    axios.post('/api/auth/login', {
        email: credentials.email,
        password: credentials.password,
    })
        // @ts-ignore
        .then(({data = {}} = {}) => {
            onSuccessLoadUser(data);
            if (onFinish) {
                onFinish(true)
            }
        })
        .catch((err) => {
            showError('Не удалось авторизоваться', err);
            dispatch(loginError());
            if (onFinish) {
                onFinish(false);
            }
        })
}
