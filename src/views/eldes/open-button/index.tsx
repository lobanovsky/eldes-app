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
    margin: 1em 0;
    width: 100%;
    height: 80px;
    color: rgb(8, 14, 12);
    font-size: 24px;
    background-color: ${(p: any) => p.color || 'gray'};
    //
    //flex: 1 0 auto;
    //width: 100%;
    //max-height: 80px;
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
                const errorMsg = JSON.stringify(err.response?.data ||  err.message || err.error);
                setLoading(false);
                // if (err.status === 401) {
                //     loadDevices();
                // }
                // else {
                    enqueueSnackbar(errorMsg, {variant: 'error'});
                // }
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
