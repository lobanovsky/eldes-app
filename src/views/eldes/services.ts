import axios from "axios";
import {ServerError} from "../../utils/types";
import {NotificationsHookResult} from "../../hooks/use-notifications";

export type AreaType = 'PARKING' | "TERRITORY";
export type ActionCallbackWithData<T> = (isSuccess: boolean, data?: T | null, serverError?: ServerError  | null) => void;
export interface Device {
    "id": string;
    "name": string;
    "label": string;
    "color": string;
    "phoneNumber":string;
    "deviceKey": string;
}

export interface Zone {
    id: number;
    name: string;
    devices: Device[];
}

export interface UserDevices {
    userId: string;
    zones: Zone[];
}

const findDevice = (devices: Device[], searchName: string)=> {
    const searchStrLowercase = searchName.toLowerCase();
    return  devices.find(({name}) => name.toLowerCase().includes(searchStrLowercase));
}

export const getDevices = ({showError}: NotificationsHookResult, onFinish: ActionCallbackWithData<UserDevices>) => {
    axios.get('/api/private/devices')
        .then(({data = {zones: []}}) => {
            onFinish(true, (data || {zones: []}) as UserDevices);
        })
        .catch((err: ServerError) => {
            showError('Не удалось загрузить список шлагбаумов', err);
            onFinish(false, null);
        })
}
