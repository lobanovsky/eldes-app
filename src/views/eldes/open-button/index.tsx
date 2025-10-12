import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {Button, styled} from "@mui/material";
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

const StyledButton = styled(Button)<{ color: string }>`

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
            })
            .catch(err => {
                setLoading(false);
                showError('Не удалось открыть шлагбаум', err);
            })
    }, [userId, device?.deviceKey]);

    const callToOpen = useCallback((phoneNumber: string) => {
        //todo проверить на русс телефон
        if (phoneNumber&& phoneNumber.startsWith('7')) {
            window.open(`tel:+${phoneNumber}`);
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
            {!!device?.phoneNumber && <StyledButton
                style={{width: '120px', paddingTop: 12, paddingBottom: 12, lineHeight: '32px'}}
                className='custom-button open-delayed'
                variant="contained"
                // @ts-ignore
                color={device?.color || 'gray'}
                size='large'
                loading={loading}
                disabled={delayCountdown > 0}
                onClick={() => {
                    callToOpen(device?.phoneNumber);
                }}>
                <PhoneIcon style={{fontSize: '32px'}}/>
            </StyledButton>
            }
            {openBtn}
        </>
    </GateComposedButton>
}
