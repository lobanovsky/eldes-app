import {useCallback, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import styled from 'styled-components';
import { Card, CardContent, Typography} from "@mui/material";
import {UserDevices, getDevices} from "./services";
import {GateOpenButton} from "./open-button";
import {Loading} from "components/loading";
import {FlexBox} from "components/styled";
import {useNotifications} from "hooks";
import {getAuth} from "store/auth/selectors";




const ZoneCard = styled(Card)`
    min-width: 300px;
    max-width: 420px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.5) !important;
`

export const EldesController = () => {
    //так делать некрасиво, но пока лень
    const {user} = useSelector(getAuth);
    const notificationsApi = useNotifications();
    const [data, setData] = useState<UserDevices>({
        userId: '',
        zones: []
    });

    const [loading, setLoading] = useState(false);

    const loadDevices = useCallback(() => {
        setLoading(true);
        getDevices(notificationsApi, (isSuccess, loadedMap) => {
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
        <FlexBox flex-direction='column' justify-content='center' className='eldes view' style={{minHeight: 'calc(100% - 1em)', paddingBottom: '1em', boxSizing: 'border-box'}} gap={'48px'}>
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
