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
    type: 'IN' | 'OUT';
    area?: string;
}

const StyledButton = styled(Button)`
    margin: 1em 0;
    font-size: 1.5rem;
    padding: 15px 30px;
    min-width: 250px;
    min-height: 60px;
    width: 100%;
    text-transform: capitalize;
`

export const GateOpenButton = ({type, userId, device, area}: GateOpenProps) => {
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

    // Use different colors for Паркинг buttons
    const getButtonColor = () => {
        if (area === 'Паркинг') {
            return type === 'IN' ? 'secondary' : 'warning';
        }
        return type === 'IN' ? 'success' : 'primary';
    };

    return <StyledButton
        color={getButtonColor()}
        variant="contained"
        size='large'
        loading={loading}
        startIcon={type == 'IN' ? <GetAppIcon fontSize="large"/> : <UploadIcon fontSize="large"/>}
        onClick={openEldes}>
        {type === 'IN' ? 'Заехать' : 'Выехать'}
    </StyledButton>
}
