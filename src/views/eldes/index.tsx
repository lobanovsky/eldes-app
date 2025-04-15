import {useCallback, useEffect, useState} from "react";
import {Button, CircularProgress, styled, Typography} from "@mui/material";
import axios from "axios";



interface Device {
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

interface UserDevices {
    userId: string;
    devices: Device[];
}

const StyledButton = styled(Button)`
    margin-bottom: 2em`

const TestData: UserDevices = {
    "userId": "42659",
    "devices": [
        {
            "id": "44925",
            "name": "Паркинг-А",
            "signalStrength": 75,
            "modelName": "ESIM320_2G",
            "firmware": "V32.00.03",
            "imei": "357788101744828",
            "phoneNumber": "79267049648",
            "status": "up",
            "deviceKey": "a3fe88282781b73baaf3b5a8561de9915a286c29"
        },
        {
            "id": "42668",
            "name": "Паркинг-Б",
            "signalStrength": 75,
            "modelName": "ESIM320_2G",
            "firmware": "V32.00.03",
            "imei": "357788101803053",
            "phoneNumber": "79267049709",
            "status": "down",
            "deviceKey": "c81b19d5d03e22d479742023fdc5a11a192f71b3"
        },
        {
            "id": "38356",
            "name": "Шлагбаум-Б",
            "signalStrength": 75,
            "modelName": "ESIM320",
            "firmware": "V31.02.00",
            "imei": "353738084535796",
            "phoneNumber": "79037758656",
            "status": "down",
            "deviceKey": "92ad32a3ad68beda7a1d14e20b0a67cae9817fd4"
        },
        {
            "id": "38344",
            "name": "Шлагбаум-А",
            "signalStrength": 75,
            "modelName": "ESIM320",
            "firmware": "V31.02.00",
            "imei": "353738084514114",
            "phoneNumber": "79031785152",
            "status": "up",
            "deviceKey": "64e1fd53355f345c1a0943f1ac06032cad07a1dc"
        }
    ]
}

export const EldesController = () => {
    const [data, setData] = useState<UserDevices>({...TestData});
    const [loading, setLoading] = useState(false);

    const loadDevices = useCallback(() => {
        setLoading(true);
        axios.get('/api/devices')
            .then(resp => {
                setLoading(false);
                setData(resp.data);
            })
            .catch(err => {
                setLoading(false);
                //todo показать ошибку
            })
    }, []);

    const openEldes = useCallback(({id, deviceKey}: Device) => {
        setLoading(true);
        axios.post(`api/devices/${id}/open`, {key: deviceKey, userId: data.userId})
            .then(resp => {
                setLoading(false);
                setData(resp.data);
            })
            .catch(err => {
                setLoading(false);
                //todo показать ошибку
            })
    }, [data.userId]);

    useEffect(() => {
        loadDevices();
    }, []);

    return (<div style={{padding: '2em 1em', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Typography variant="h6" gutterBottom style={{marginBottom: '1em'}}>
            Открыть шлагбаум
        </Typography>
        {loading && <CircularProgress/>}
        {data.devices.map(d =>
            <StyledButton key={d.id} size='large' variant="outlined" onClick={() => {
                openEldes(d)
            }}>
                {d.name}
            </StyledButton>
        )}
    </div>)
}
