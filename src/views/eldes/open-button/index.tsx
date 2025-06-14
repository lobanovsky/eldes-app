
import {useCallback, useState} from "react";
import axios from "axios";
import {Button, styled} from "@mui/material";
import {Device} from "../services";
import {FlexBox} from "components/styled";
import {useNotifications} from "hooks";


interface GateOpenProps {
    device: Device | null;
    userId: string;
    loadDevices: () => void;
}

const PARKING_GATE_DELAY_SECONDS = 60;

const StyledButton = styled(Button)<{ color: string }>`

    width: 100%;
    height: 72px;
    color: rgb(8, 14, 12);
    font-size: 24px;
    text-transform: none !important;
    background-color: ${(p: any) => p.color || 'gray'};

    &:not(:last-child) {
        margin-bottom: 1em;
    }
`

export const GateOpenButton = ({userId, device, loadDevices}: GateOpenProps) => {
    const [loading, setLoading] = useState(false);
    const {showError, showMessage} = useNotifications()

    const openEldes = useCallback(() => {
        if (!device?.deviceKey) {
            return;
        }
        setLoading(true);
        axios.post(`api/private/devices/${device.id}/open`, {key: device.deviceKey, userid: userId})
            .then(() => {
                // showMessage('Шлагбаум открыт!', {autoHideDuration: 2000});
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
        axios.post(`api/private/devices/${device.id}/open-delayed?delay=${PARKING_GATE_DELAY_SECONDS}`, {key: device.deviceKey, userid: userId})
            .then(() => {
                showMessage(`Шлагбаум откроется через ${PARKING_GATE_DELAY_SECONDS} сек`, {autoHideDuration: 2000});
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                showError('Не удалось открыть шлагбаум', err);
            })
    }, [userId, device?.deviceKey]);

    const openBtn = <StyledButton
        className='custom-button'
        variant="contained"
        // @ts-ignore
        color={device?.color || 'gray'}
        size='large'
        loading={loading}
        onClick={openEldes}>
        {device?.label}
    </StyledButton>;

    const isParkingOut = (device?.name || '')?.toLowerCase() === 'паркинг-б';
    return !isParkingOut ? openBtn : <FlexBox flex-direction='row' gap={'2em'
    } justify-content='flex-start' align-items='flex-start'>
        {openBtn}
        <StyledButton
            style={{width: '120px', paddingTop: 12, paddingBottom: 12, lineHeight: '32px'}}
            className='custom-button open-delayed'
            variant="contained"
            // @ts-ignore
            color={device?.color || 'gray'}
            size='large'
            loading={loading}
            onClick={openWithDelay}>
            {PARKING_GATE_DELAY_SECONDS} сек
        </StyledButton>
    </FlexBox>
}
