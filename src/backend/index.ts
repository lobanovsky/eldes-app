import axios from "axios";
import {logout} from "../store/auth/reducer";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

export const axiosNotAuthorizedInterceptor = (error: any, dispatch: any) => {
    // Reject promise if usual error
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // showError('Время сессии истекло. Пожалуйста, авторизуйтесь заново');
        // @ts-ignore
        dispatch(logout());
    }
    return Promise.reject(error);
};
