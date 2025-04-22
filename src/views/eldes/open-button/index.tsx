import {Device} from "../services";
import {useCallback, useState} from "react";
import axios from "axios";
import {useSnackbar} from "notistack";
import {Button, styled, SvgIcon} from "@mui/material";

interface GateOpenProps {
    device: Device | null;
    userId: string;
    type: 'IN' | 'OUT'
    color: string;
    loadDevices: () => void;
}

const StyledButton = styled(Button)<{ type: string }>`
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

export const GateOpenButton = ({type, userId, device, color, loadDevices}: GateOpenProps) => {
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
                const errorMsg = JSON.stringify(err.response?.data ||  err.message || err.error);
                setLoading(false);
                if (err.status === 401) {
                    loadDevices();
                }
                else {
                    enqueueSnackbar(errorMsg, {variant: 'error'});
                }
            })
    }, [userId, device?.deviceKey, loadDevices]);

    return <StyledButton
        className='custom-button'
        variant="contained"
        // @ts-ignore
        color={color}
        // background-color={color}
        size='large'
        loading={loading}
        startIcon={type == 'IN' ? (
            <SvgIcon style={{marginRight: 3, fontSize: '24px'}}>
                <svg fill="currentColor" width="28px" height="28px" viewBox="0 0 512 512" id="_04_In_alt_"
                     data-name="04 In (alt)" xmlns="http://www.w3.org/2000/svg">
                    <g id="Group_12" data-name="Group 12">
                        <path id="Path_6" data-name="Path 6"
                              d="M480,0H256a32,32,0,0,0,0,64H448V448H256a32,32,0,0,0,0,64H480a31.991,31.991,0,0,0,32-32V32A31.991,31.991,0,0,0,480,0Z"
                              fill-rule="evenodd"/>
                        <path id="Path_7" data-name="Path 7"
                              d="M224,384,352,256,224,128v96H28.591C12.788,224,0,238.328,0,256s12.788,32,28.591,32H224Z"
                              fill-rule="evenodd"/>
                    </g>
                </svg>
            </SvgIcon>
        ) : (
            <SvgIcon style={{fontSize: '24px'}}>
                <svg style={{transform: 'rotate(90deg)'}} fill="currentColor" width="1em" height="1em"
                     viewBox="0 0 512 512"
                     id="_02_Out" data-name="02 Out" xmlns="http://www.w3.org/2000/svg">
                    <g id="Group_7" data-name="Group 7">
                        <path id="Path_2" data-name="Path 2"
                              d="M480,224a31.991,31.991,0,0,0-32,32V448H64V256a32,32,0,0,0-64,0V480a31.991,31.991,0,0,0,32,32H480a31.991,31.991,0,0,0,32-32V256A31.991,31.991,0,0,0,480,224Z"
                              fill-rule="evenodd"/>
                        <path id="Path_3" data-name="Path 3" d="M224,320a32,32,0,0,0,64,0V128h96L256,0,128,128h96Z"
                              fill-rule="evenodd"/>
                    </g>
                </svg>
            </SvgIcon>)}
        onClick={
            openEldes
        }>
        {
            type === 'IN' ? 'Заехать' : 'Выехать'
        }
    </StyledButton>
}
