import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import {Button, styled as styledMui} from "@mui/material";
import {useSelector} from "react-redux";
import {Device} from "../services";
import {FlexBox} from "components/styled";
import {useNotifications} from "hooks";

import PhoneIcon from '@mui/icons-material/Phone';

interface GateOpenProps {
    device: Device | null;
    userId: string;
    loadDevices: () => void;
}

const PARKING_GATE_DELAY_SECONDS = 45;

const StyledLink = styled.a<{ color?: string }>`
    width: 70px;
    line-height: 70px;
    height: 70px;
    padding-top: 8px;
    min-width: 70px;
    color: rgb(8, 14, 12);
    border-radius: 4px;
    font-size: 24px;
    text-transform: none !important;
    background-color: ${(p: any) => p.color || 'gray'};
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);

    &:hover {
        box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
    }
`;

const StyledButton = styledMui(Button)<{ color: string }>`

    width: 100%;
    height: 72px;
    color: rgb(8, 14, 12);
    font-size: 24px;
    text-transform: none !important;
    background-color: ${(p: any) => p.color || 'gray'};

    &:not(:last-child) {
        //margin-bottom: 1.5em;
    }

    &.open-delayed {
        &:disabled {
            color: #fa1e72;
        }

    }
`

const GateComposedButton = styled(FlexBox)`
    flex-direction: row;
    gap: 2em;
    justify-content: flex-start;
    align-items: flex-start;

    &:not(:last-child) {
        margin-bottom: 2em;
    }
`

export const GateOpenButton = ({userId, device, loadDevices}: GateOpenProps) => {
    const [loading, setLoading] = useState(false);
    const {showError, showMessage} = useNotifications();
    const [delayCountdown, setCountdown] = useState(0);
    let timer = 0;
    const user = useSelector((state: any) => state.auth.user.user);

    const logEvent = useCallback((deviceId: string, label: string) => {
        axios.post(`api/private/devices/${deviceId}/event-log`, {
            status: 'Открыто',
            line: `${label} через приложение`,
            method: 'Приложение',
            userName: user?.email,
            phoneNumber: user?.phoneNumber,
        }).catch(() => {});
    }, [user?.email, user?.phoneNumber]);

    const countdown = useCallback(() => {
        setCountdown(PARKING_GATE_DELAY_SECONDS);
        // @ts-ignore
        timer = setInterval(() => {
            setCountdown((time) => {
                if (time === 0) {
                    clearInterval(timer);
                    timer = 0;
                    return 0;
                } else return time - 1;
            });
        }, 1000);
    }, []);

    const openEldes = useCallback(() => {
        if (!device?.deviceKey) {
            return;
        }
        setLoading(true);
        axios.post(`api/private/devices/${device.id}/open`, {key: device.deviceKey, userid: userId})
            .then(() => {
                setLoading(false);
                logEvent(device.id, device.label || 'Шлагбаум');
            })
            .catch(err => {
                setLoading(false);
                showError('Не удалось открыть шлагбаум', err);
            })
    }, [userId, device?.deviceKey]);

    const openWithDelay = useCallback(() => {

        if (!device?.deviceKey) {
            return;
        }

        setLoading(true);
        axios.post(`api/private/devices/${device.id}/open-delayed?delay=${PARKING_GATE_DELAY_SECONDS}`, {
            key: device.deviceKey,
            userid: userId
        })
            .then(() => {
                showMessage(`Ворота откроются через ${PARKING_GATE_DELAY_SECONDS} сек`, {autoHideDuration: 5000});
                setLoading(false);
                countdown();
                logEvent(device.id, device.label || 'Шлагбаум');
            })
            .catch(err => {
                setLoading(false);
                showError('Не удалось открыть шлагбаум', err);
            })
    }, [userId, device?.deviceKey]);

    const callToOpen = useCallback((phoneNumber: string) => {
        if (phoneNumber && phoneNumber.startsWith('7')) {
            window.open(`tel:+${phoneNumber}`, "_blank");
        }

    }, []);

    useEffect(() => () => {
        clearInterval(timer);
        timer = 0;
    }, []);

    const isParkingOut = (device?.name || '')?.toLowerCase() === 'паркинг-б';

    const openBtn = <StyledButton
        className='custom-button'
        variant="contained"
        // @ts-ignore
        color={device?.color || 'gray'}
        size='large'
        loading={loading}
        disabled={isParkingOut && delayCountdown > 0}
        onClick={openEldes}>
        {device?.label}
    </StyledButton>;

    return <GateComposedButton>
        <>
            {!!device?.phoneNumber &&
                <StyledLink color={device?.color || 'gray'} href={`tel:+${device.phoneNumber}`} role='link'>
                    <PhoneIcon style={{fontSize: '32px'}}/>
                </StyledLink>
                // <StyledButton
                // style={{width: '120px', paddingTop: 12, paddingBottom: 12, lineHeight: '32px'}}
                // className='custom-button open-delayed'
                // variant="contained"
                // // @ts-ignore
                // color={device?.color || 'gray'}
                // size='large'
                // loading={loading}
                // disabled={delayCountdown > 0}
                // onClick={() => {
                //     callToOpen(device?.phoneNumber);
                // }}>

                // </StyledButton>
            }
            {openBtn}
        </>
    </GateComposedButton>
}
