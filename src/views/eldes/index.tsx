import {useCallback, useEffect, useState} from "react";
import {AxiosError, AxiosResponse} from 'axios';
import {Button, Card, CardContent, CircularProgress, styled, Typography} from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';
import UploadIcon from '@mui/icons-material/Upload';
import axios from "axios";
import {useSnackbar} from 'notistack';
import {UserDevices, getDevices, Device} from "./services";
import {GateOpenButton} from "./open-button";


// @ts-ignore
export interface ServerError extends Error, AxiosError, AxiosResponse {
    error?: string;
}



export const EldesController = () => {
    const [data, setData] = useState<UserDevices>({
        userId: '',
        devices: []
    });
    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const loadDevices = useCallback(() => {
        setLoading(true);
        getDevices(enqueueSnackbar, (isSuccess, loadedMap) => {
            setLoading(false);
            if (isSuccess && loadedMap?.devices.length) {
                setData(loadedMap);
            }

        })
    }, []);

    useEffect(() => {
        loadDevices();
    }, []);

    return (<div style={{padding: '2em 1em', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {/*<Typography variant="h6" gutterBottom style={{marginBottom: '1em'}}>*/}
        {/*    Открыть шлагбаум*/}
        {/*</Typography>*/}
        {loading && <CircularProgress/>}
        {data.devices.map((area) =>
            <Card sx={{minWidth: 300}} style={{marginBottom: 20}} key={area.name}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {area.name}
                    </Typography>
                    <div className='buttons'>
                        <div>
                            <GateOpenButton type='IN' userId={data.userId} device={area.IN}/>
                        </div>
                        {area.OUT?.id && <div>
                            <GateOpenButton type='OUT' userId={data.userId} device={area.OUT}/>
                        </div>}
                    </div>
                </CardContent>
            </Card>
        )}
    </div>)
}
