import {ServerError} from "./types";

export const getErrorMessage  = (defaultMsg: string, axiosError?: ServerError) => {
    const errorMsg = axiosError?.response?.data || axiosError?.message || axiosError?.error || axiosError?.response || '';
    return <div>
        <div>{defaultMsg}{!defaultMsg.endsWith('.') ? '.' : ''}<br/><br/></div>
        <div>{typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}</div>
    </div>
}
