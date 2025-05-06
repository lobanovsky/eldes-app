import {useCallback, useEffect, useState} from "react";
import axios, {AxiosError, AxiosResponse} from 'axios';
import styled from 'styled-components';
import {Button, Card, CardContent, CircularProgress, Typography} from "@mui/material";
import {useSnackbar} from 'notistack';
import {UserDevices, getDevices, Device, AreaType} from "./services";
import {GateOpenButton} from "./open-button";
import {FlexBox} from "components/styled";
import {IS_DEBUG} from "../../utils/constants";
import {useSelector} from "react-redux";
import {getAuth} from "../../store/auth/selectors";




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
    //так делать некрасиво, но пока лень
    const {
        user,
        isUserLoggedIn,
        isCheckingToken
    } = useSelector(getAuth);
    const [data, setData] = useState<UserDevices>({
        userId: '',
        zones: []
    });
    let firstUnauthorized = false;
    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const loadDevices = useCallback(() => {
        setLoading(true);
        getDevices(enqueueSnackbar, (isSuccess, loadedMap) => {
            setLoading(false);
            if (isSuccess && loadedMap?.zones?.length) {
                setData(loadedMap);
            }

        })
    }, []);

    useEffect(() => {
        if (user.token) {
            loadDevices();
        }

    }, [user.token]);


    // @ts-ignore
    return (
        // <div>
        // @ts-ignore
        <FlexBox flex-direction='column'>
            {loading && <CircularProgress/>}
            {data.zones.map((zone) =>
                <div className='card-container' key={zone.id}>
                    <StyledCard>
                        <CardContent style={{height: '100%'}}>
                            <Typography variant="h6" component="div" style={{marginBottom: '0.5em'}}>
                                {zone.name}
                            </Typography>
                            {/*@ts-ignore */}
                            {/*<FlexBox flex-direction='column' height='calc(100% - 32px - 1em)'>*/}
                            {zone.devices.map((device) => (
                                <div className='buttons' key={device.id}>
                                    <GateOpenButton
                                        loadDevices={loadDevices}
                                        userId={data.userId}
                                        device={device}
                                    />
                                </div>
                            ))}

                            {/*</FlexBox>*/}
                        </CardContent>
                    </StyledCard>
                </div>
            )}
        </FlexBox>
    )
}
