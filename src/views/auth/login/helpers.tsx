import axios from 'axios';

import { axiosNotAuthorizedInterceptor } from 'backend';
import store from 'store';
import { loginSuccess } from 'store/auth/reducer';
import { LoginData } from 'utils/types';
import {getMobileOperatingSystem} from "../../../utils/utils";


export const onSuccessLoadUser = (userData: LoginData) => {
    const { token } = userData;
    axios.defaults.headers.Authorization = token ? `Bearer ${token}` : '';
    axios.interceptors.response.use((response) => response, (resp) => axiosNotAuthorizedInterceptor(resp, store.dispatch));
    store.dispatch(loginSuccess(userData));
}
