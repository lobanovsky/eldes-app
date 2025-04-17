import {Device} from "../services";
import {useCallback, useState} from "react";
import axios from "axios";
import {useSnackbar} from "notistack";
import GetAppIcon from "@mui/icons-material/GetApp";
import UploadIcon from '@mui/icons-material/Upload';
import {Button, styled} from "@mui/material";

interface GateOpenProps {
    device: Device | null;
    userId: string;
    type: 'IN' | 'OUT'
}

const StyledButton = styled(Button)`
    margin: 1em 0;
`

export const GateOpenButton = ({type, userId, device}: GateOpenProps) => {
    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const openEldes = useCallback(() => {
        if (!device?.deviceKey) {
            return;
        }
        setLoading(true);
        axios.post(`api/devices/${device.id}/open`, {key: device.deviceKey, userId})
            .then(resp => {
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                enqueueSnackbar(err.message || err.error || err.response, {variant: 'error'});
            })
    }, [userId]);

    return <StyledButton
        color={type === 'IN' ? 'success' : 'error'}
        variant="contained"
        size='large'
        loading={loading}
        startIcon={type == 'IN' ? <GetAppIcon/> : <UploadIcon/>}
        onClick={openEldes}>
        {type === 'IN' ? 'въезд' : 'выезд'}
    </StyledButton>
}
