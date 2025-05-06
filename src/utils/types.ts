import {AxiosError, AxiosResponse} from "axios";

export interface UserInfo  {
    id: number;
    email: string;
    phoneNumber: string;
    registrationDate: string;
    isActive: boolean
}
export interface LoginData {
    token: string;
    loginPassword?: string;
    user: UserInfo
}

// @ts-ignore
export interface ServerError extends Error, AxiosError, AxiosResponse {
    error?: string;
}

export type VoidFn = () => void;
export type VoidFnT<T> = (data: T) => void;

