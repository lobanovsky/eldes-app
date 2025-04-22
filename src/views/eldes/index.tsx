import {useCallback, useEffect, useState} from "react";
import {AxiosError, AxiosResponse} from 'axios';
import styled from 'styled-components';
import {Button, Card, CardContent, CircularProgress, Typography} from "@mui/material";
import {useSnackbar} from 'notistack';
import {UserDevices, getDevices, Device, AreaType} from "./services";
import {GateOpenButton} from "./open-button";
import {FlexBox} from "components/styled";


// @ts-ignore
export interface ServerError extends Error, AxiosError, AxiosResponse {
    error?: string;
}


const StyledCard = styled(Card)`
    min-width: 300px;
    width: 100%;
    //height: 100%;
`

const ButtonColors: Record<AreaType, { IN: string, OUT: string }> = {
    PARKING: {
        IN: '#88DBF2',
        OUT: '#BDDDFC'
    },
    TERRITORY: {
        IN: '#D4DE95',
        OUT: '#BAC095'
    }
}


export const EldesController = () => {
    const [data, setData] = useState<UserDevices>({
        userId: '',
        devices: []
    });
    let firstUnauthorized = false;
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


    // @ts-ignore
    return (
        // <div>
        // @ts-ignore
        <FlexBox flex-direction='column'>
            {loading && <CircularProgress/>}
            {data.devices.map((area) =>
                <div className='card-container' key={area.name}>
                    <StyledCard key={area.name}>
                        <CardContent style={{height: '100%'}}>
                            <Typography variant="h6" component="div" style={{marginBottom: '0.5em'}}>
                                {area.name}
                            </Typography>
                            {/*@ts-ignore */}
                            {/*<FlexBox flex-direction='column' height='calc(100% - 32px - 1em)'>*/}
                            <div className='buttons'>
                                <GateOpenButton
                                    loadDevices={loadDevices}
                                    color={ButtonColors[area.area].IN}
                                    type='IN' userid={data.userId}
                                    device={area.IN}/>

                                {area.OUT?.id &&
                                    <GateOpenButton
                                        loadDevices={loadDevices}
                                        color={ButtonColors[area.area].OUT}
                                        type='OUT'
                                        userid={data.userId}
                                        device={area.OUT}/>
                                }
                            </div>
                            {/*</FlexBox>*/}
                        </CardContent>
                    </StyledCard>
                </div>
            )}
        </FlexBox>
    )
}
