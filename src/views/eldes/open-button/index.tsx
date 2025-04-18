import {Device} from "../services";
import {useCallback, useState} from "react";
import axios from "axios";
import {useSnackbar} from "notistack";
import GetAppIcon from "@mui/icons-material/GetApp";
import UploadIcon from '@mui/icons-material/Upload';
import {Button, styled} from "@mui/material";
import {StyledComponentProps} from "../../../components/styled";

interface GateOpenProps {
    device: Device | null;
    userId: string;
    type: 'IN' | 'OUT'
}

const StyledButton = styled(Button)<any>`
    margin: 1em 0;
    width: 100%;
    height: 80px;
    font-size: 24px;
    background-color: ${(p: any) => p.type === 'success' ? 'rgb(46, 125, 50)' : 'rgb(125, 73, 28)'};
    //
    //flex: 1 0 auto;
    //width: 100%;
    //max-height: 80px;
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
        className='custom-button'
        type={type === 'IN' ? 'success' : 'error'}
        variant="contained"
        size='large'
        loading={loading}
        startIcon={type == 'IN' ? <GetAppIcon style={{fontSize: '32px'}}/> : <UploadIcon style={{fontSize: '32px'}}/>}
        onClick={openEldes}>
        {type === 'IN' ? 'въезд' : 'выезд'}
    </StyledButton>
}
