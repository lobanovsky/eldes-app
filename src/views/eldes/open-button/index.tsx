import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import {Button, CircularProgress, styled as styledMui} from "@mui/material";
import {Device} from "../services";
import {FlexBox} from "components/styled";
import {useNotifications} from "hooks";

import PhoneIcon from '@mui/icons-material/Phone';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface GateOpenProps {
    device: Device | null;
    userId: string;
    loadDevices: () => void;
}

const PARKING_GATE_DELAY_SECONDS = 45;
const ACTIVATING_FEEDBACK_MS = 2000;

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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
    padding-right: 16px;

    &:not(:last-child) {
        //margin-bottom: 1.5em;
    }

    &.open-delayed {
        &:disabled {
            color: #fa1e72;
        }

    }
`

const ArrowCircle = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid currentColor;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
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
    const [isActivating, setIsActivating] = useState(false);
    const activatingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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

    const triggerActivating = useCallback(() => {
        setIsActivating(true);
        activatingTimer.current = setTimeout(() => {
            setIsActivating(false);
        }, ACTIVATING_FEEDBACK_MS);
    }, []);

    const openEldes = useCallback(() => {
        if (!device?.deviceKey) {
            return;
        }
        triggerActivating();
        setLoading(true);
        axios.post(`api/private/devices/${device.id}/open`, {key: device.deviceKey, userid: userId})
            .then(() => {
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                showError('Не удалось открыть шлагбаум', err);
            })
    }, [userId, device?.deviceKey, triggerActivating]);

    const openWithDelay = useCallback(() => {

        if (!device?.deviceKey) {
            return;
        }

        triggerActivating();
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
    }, [userId, device?.deviceKey, triggerActivating]);

    const callToOpen = useCallback((phoneNumber: string) => {
        if (phoneNumber && phoneNumber.startsWith('7')) {
            window.open(`tel:+${phoneNumber}`, "_blank");
        }

    }, []);

    useEffect(() => () => {
        clearInterval(timer);
        timer = 0;
        if (activatingTimer.current) clearTimeout(activatingTimer.current);
    }, []);

    const isParkingOut = (device?.name || '')?.toLowerCase() === 'паркинг-б';

    const labelLower = (device?.label || '').toLowerCase();
    const arrowDeg = labelLower.includes('заехать') ? 45 : -45;

    const openBtn = <StyledButton
        className='custom-button'
        variant="contained"
        // @ts-ignore
        color={device?.color || 'gray'}
        size='large'
        loading={loading}
        disabled={isActivating || (isParkingOut && delayCountdown > 0)}
        sx={{
            backgroundColor: isActivating ? '#f5a623 !important' : undefined,
            '&.Mui-disabled': {
                backgroundColor: isActivating ? '#f5a623' : undefined,
                color: 'rgb(8, 14, 12)',
            }
        }}
        onClick={openEldes}>
        <span style={{textAlign: 'left'}}>{isActivating ? 'Ждите...' : device?.label}</span>
        <ArrowCircle>
            {isActivating
                ? <CircularProgress size={20} style={{color: 'rgb(8, 14, 12)'}}/>
                : <ArrowForwardIcon style={{transform: `rotate(${arrowDeg}deg)`, fontSize: '20px'}}/>
            }
        </ArrowCircle>
    </StyledButton>;

    return <GateComposedButton>
        <>
            {!!device?.phoneNumber &&
                <StyledLink color={device?.color || 'gray'} href={`tel:+${device.phoneNumber}`} role='link'>
                    <PhoneIcon style={{fontSize: '32px'}}/>
                </StyledLink>
            }
            {openBtn}
        </>
    </GateComposedButton>
}
