import {useCallback, useEffect, useState} from "react";
import styled from 'styled-components';
import { Card, CardContent, Typography} from "@mui/material";
import {useSnackbar} from 'notistack';
import {UserDevices, getDevices, Device, AreaType} from "./services";
import {GateOpenButton} from "./open-button";
import {FlexBox} from "components/styled";
import {useSelector} from "react-redux";
import {getAuth} from "../../store/auth/selectors";
import {Loading} from "../../components/loading";


const ZoneCard = styled(Card)`
    min-width: 300px;
    max-width: 420px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.5) !important;
    //height: 100%;
`

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
        <FlexBox flex-direction='column' className='eldes view' style={{minHeight: 'calc(100% - 110px)', paddingBottom: '1em'}}>
            {loading && <Loading text='Загружаем шлагбаумы'/>}
            {data.zones.map((zone) =>
                <ZoneCard variant='outlined' key={zone.id}>
                    <CardContent>
                        <Typography variant="h6" component="div" style={{marginBottom: '0.5em'}}>
                            {zone.name}
                        </Typography>
                        {zone.devices.map((device) => (
                            <GateOpenButton
                                key={device.id}
                                loadDevices={loadDevices}
                                userId={data.userId}
                                device={device}
                            />
                        ))}
                    </CardContent>
                </ZoneCard>
            )}
        </FlexBox>
    )
}
