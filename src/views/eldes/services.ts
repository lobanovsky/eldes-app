import axios from "axios";
import {ServerError} from "./index";

export type ActionCallbackWithData<T> = (isSuccess: boolean, data?: T | null) => void;
export interface Device {
    id: string;
    name: string;
    signalStrength: number;
    modelName: string;
    firmware: string;
    imei: string;
    phoneNumber: string;
    status: string;
    deviceKey: string;
}

export interface AreaGate {
    name: string;
    IN: Device | null;
    OUT: Device | null
}

export interface UserDevices {
    userId: string;
    devices: AreaGate[];
}

const findDevice = (devices: Device[], searchName: string)=> {
    const searchStrLowercase = searchName.toLowerCase();
    return  devices.find(({name}) => name.toLowerCase().includes(searchStrLowercase));
}

export const getDevices = (enqueueSnackbar: any, onFinish: ActionCallbackWithData<UserDevices>) => {
    axios.get('/api/devices')
        .then(({data: {userId = '', devices = []} = {}}) => {
            const result: UserDevices = {
                userId,
                devices: []
            }
            const gateA = findDevice(devices, 'Шлагбаум-А');
            if (gateA?.id) {
                const gateB = findDevice(devices, 'Шлагбаум-Б');
                result.devices.push({
                    name: 'Шлагбаум',
                    IN: gateA,
                    OUT: gateB || null
                });
            }

            const parkingA = findDevice(devices, 'Паркинг-А');
            if (parkingA?.id) {
                const parkingB = findDevice(devices, 'Паркинг-Б');
                result.devices.push({
                    name: 'Ворота паркинга',
                    IN: parkingA,
                    OUT: parkingB || null
                });
            }
            onFinish(true, result);
        })
        .catch((err: ServerError) => {
            // @ts-ignore
            enqueueSnackbar(err.message || err.error  || err.response, {variant: 'error'});
            onFinish(false);
        })
}
