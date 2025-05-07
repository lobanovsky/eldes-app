import {Device} from "../services";
import {useCallback, useState} from "react";
import axios from "axios";
import {useSnackbar} from "notistack";
import {Button, styled, SvgIcon} from "@mui/material";

interface GateOpenProps {
    device: Device | null;
    userId: string;
    loadDevices: () => void;
}

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
    const {enqueueSnackbar} = useSnackbar();

    const openEldes = useCallback(() => {
        if (!device?.deviceKey) {
            return;
        }
        setLoading(true);
        axios.post(`api/private/devices/${device.id}/open`, {key: device.deviceKey, userid: userId})
            .then(resp => {
                setLoading(false);
            })
            .catch(err => {
                const errorMsg = JSON.stringify(err.response?.data || err.message || err.error);
                setLoading(false);
                enqueueSnackbar(errorMsg, {variant: 'error'});
            })
    }, [userId, device?.deviceKey]);

    return <StyledButton
        className='custom-button'
        variant="contained"
        // @ts-ignore
        color={device?.color || 'gray'}
        size='large'
        loading={loading}
        onClick={openEldes}>
        {device?.label}
    </StyledButton>
}
