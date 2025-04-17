import {useCallback, useEffect, useState} from "react";
import {AxiosError, AxiosResponse} from 'axios';
import {Button, Card, CardContent, CircularProgress, styled, Typography, Box} from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';
import UploadIcon from '@mui/icons-material/Upload';
import HomeIcon from '@mui/icons-material/Home';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
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

    return (<div style={{padding: '1em 0.5em', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100vh'}}>
        {/*<Typography variant="h6" gutterBottom style={{marginBottom: '1em'}}>*/}
        {/*    Открыть шлагбаум*/}
        {/*</Typography>*/}
        {loading && <CircularProgress/>}
        {data.devices.map((area) =>
            <Card sx={{width: '100%', maxWidth: '600px'}} style={{marginBottom: 20}} key={area.name}>
                <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                        {area.name === 'Двор' ? 
                            <HomeIcon fontSize="large" style={{ marginRight: '8px', color: '#4caf50' }} /> : 
                            <LocalParkingIcon fontSize="large" style={{ marginRight: '8px', color: '#9c27b0' }} />
                        }
                        <Typography variant="h6" component="div" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            {area.name}
                        </Typography>
                    </Box>
                    <div className='buttons'>
                        {area.OUT?.id && <div>
                            <GateOpenButton type='OUT' userId={data.userId} device={area.OUT} area={area.name}/>
                        </div>}
                        <div>
                            <GateOpenButton type='IN' userId={data.userId} device={area.IN} area={area.name}/>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}
    </div>)
}
