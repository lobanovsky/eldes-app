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
    max-width: 460px;
    padding: 0.25em 0;
    width: 100%;
    background-color: #161d27 !important;
    border: 1px solid #2b3544 !important;
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.32) !important;
`

const ZoneHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1em;
    text-align: left;
`

const ZoneIconBox = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #2b3544;
    background: #1b2430;
    color: #bac9e2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`

const BarrierIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="5" y="13" width="3" height="7" rx="1" fill="#e8eef8"/>
        <rect x="4" y="19" width="6" height="2" rx="1" fill="#8792a3"/>
        <g transform="rotate(-18 12 10)">
            <rect x="3" y="8" width="18" height="4" rx="1.5" fill="#f8fafc"/>
            <path d="M6 8h4l-3 4H3zM13 8h4l-3 4h-4z" fill="#d92d20"/>
        </g>
        <circle cx="6.5" cy="13" r="2" fill="#d92d20"/>
        <circle cx="6.5" cy="13" r="0.8" fill="#f8fafc"/>
    </svg>
)

const ParkingGateIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="4" fill="#1d4ed8"/>
        <path
            d="M8 17V7h5.1c2.2 0 3.7 1.45 3.7 3.45S15.3 13.9 13.1 13.9h-2.5V17H8zm2.6-5.25h2.2c.85 0 1.4-.5 1.4-1.3 0-.78-.55-1.28-1.4-1.28h-2.2v2.58z"
            fill="#ffffff"
        />
        <path d="M6 19h12" stroke="#bfdbfe" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
)

const getZoneIcon = (zoneName: string) => {
    const zoneNameLower = zoneName.toLowerCase();
    return zoneNameLower.includes('паркинг') || zoneNameLower.includes('parking')
        ? ParkingGateIcon
        : BarrierIcon;
}

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
        getDevices(user.user.id, notificationsApi, (isSuccess, loadedMap) => {
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
        <FlexBox flex-direction='column' justify-content='center' className='eldes view' style={{minHeight: 'calc(100% - 1em)', paddingBottom: '1em', boxSizing: 'border-box'}} gap={'24px'}>
            {loading && <Loading text='Загружаем шлагбаумы'/>}
            {data.zones.map((zone) =>
                <ZoneCard variant='outlined' key={zone.id}>
                    <CardContent>
                        <ZoneHeader>
                            {(() => {
                                const ZoneIcon = getZoneIcon(zone.name);
                                return <ZoneIconBox>
                                    <ZoneIcon/>
                                </ZoneIconBox>
                            })()}
                            <Typography variant="subtitle1" component="div" style={{fontWeight: 700, color: '#eef2f7'}}>
                                {zone.name}
                            </Typography>
                        </ZoneHeader>
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
