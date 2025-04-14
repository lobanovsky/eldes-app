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

export const EldesController = () => {
    const [data, setData] = useState<UserDevices>({userId: "", devices: []});
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
