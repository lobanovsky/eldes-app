import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import {Button, CircularProgress, styled as styledMui} from "@mui/material";
import {Device} from "../services";
import {FlexBox} from "components/styled";
import {useNotifications} from "hooks";
import {useSelector} from "react-redux";
import {getSoundEnabled} from "store/auth/selectors";
import {playGateSound} from "utils/sound";

import PhoneIcon from '@mui/icons-material/Phone';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface GateOpenProps {
    device: Device | null;
    userId: string;
    loadDevices: () => void;
}

const PARKING_GATE_DELAY_SECONDS = 45;
const ACTIVATING_FEEDBACK_MS = 2000;

const getAccentColor = (color?: string) => color || '#64748b';

const StyledLink = styled.a<{ accent?: string }>`
    width: 62px;
    height: 70px;
    min-width: 62px;
    color: #e8eef8;
    border-radius: 8px;
    font-size: 22px;
    text-transform: none !important;
    background-color: #1b2430;
    border: 1px solid #2b3544;
    border-left: 5px solid ${(p: any) => getAccentColor(p.accent)};
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: #222d3b;
        border-color: #3a4658;
        border-left-color: ${(p: any) => getAccentColor(p.accent)};
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.34);
    }
`;

const StyledButton = styledMui(Button, {
    shouldForwardProp: (prop) => prop !== 'accent' && prop !== 'activating',
})<{ accent?: string; activating?: boolean }>`

    width: 100%;
    min-height: 70px;
    color: #eef2f7;
    font-size: 22px;
    font-weight: 700;
    text-transform: none !important;
    background-color: ${(p: any) => p.activating ? '#2b2112' : '#1b2430'};
    border: 1px solid ${(p: any) => p.activating ? '#9a6a26' : '#2b3544'};
    border-left: 5px solid ${(p: any) => p.activating ? '#d89a35' : getAccentColor(p.accent)};
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
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
            color: #d89a35;
        }

    }

    &:hover {
        background-color: ${(p: any) => p.activating ? '#2b2112' : '#222d3b'};
        border-color: ${(p: any) => p.activating ? '#9a6a26' : '#3a4658'};
        border-left-color: ${(p: any) => p.activating ? '#d89a35' : getAccentColor(p.accent)};
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.34);
    }

    &.Mui-disabled {
        color: ${(p: any) => p.activating ? '#d89a35' : '#8792a3'};
        background-color: ${(p: any) => p.activating ? '#2b2112' : '#151c25'};
        border-color: ${(p: any) => p.activating ? '#9a6a26' : '#2b3544'};
        border-left-color: ${(p: any) => p.activating ? '#d89a35' : getAccentColor(p.accent)};
        opacity: 1;
    }
`

const ArrowCircle = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid currentColor;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`

const GateComposedButton = styled(FlexBox)`
    flex-direction: row;
    gap: 12px;
    justify-content: flex-start;
    align-items: flex-start;

    &:not(:last-child) {
        margin-bottom: 14px;
    }
`

export const GateOpenButton = ({userId, device, loadDevices}: GateOpenProps) => {
    const [loading, setLoading] = useState(false);
    const {showError, showMessage} = useNotifications();
    const [delayCountdown, setCountdown] = useState(0);
    const [isActivating, setIsActivating] = useState(false);
    const activatingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const soundEnabled = useSelector(getSoundEnabled);
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
        if (soundEnabled) playGateSound();
        activatingTimer.current = setTimeout(() => {
            setIsActivating(false);
        }, ACTIVATING_FEEDBACK_MS);
    }, [soundEnabled]);

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
    const accentColor = getAccentColor(device?.color);

    const openBtn = <StyledButton
        className='custom-button'
        variant="contained"
        accent={accentColor}
        activating={isActivating}
        size='large'
        loading={loading}
        disabled={isActivating || (isParkingOut && delayCountdown > 0)}
        onClick={openEldes}>
        <span style={{textAlign: 'left'}}>{isActivating ? 'Ждите...' : device?.label}</span>
        <ArrowCircle>
            {isActivating
                ? <CircularProgress size={20} style={{color: '#d89a35'}}/>
                : <ArrowForwardIcon style={{transform: `rotate(${arrowDeg}deg)`, fontSize: '20px'}}/>
            }
        </ArrowCircle>
    </StyledButton>;

    return <GateComposedButton>
        <>
            {!!device?.phoneNumber &&
                <StyledLink accent={accentColor} href={`tel:+${device.phoneNumber}`} role='link'>
                    <PhoneIcon style={{fontSize: '32px'}}/>
                </StyledLink>
            }
            {openBtn}
        </>
    </GateComposedButton>
}
