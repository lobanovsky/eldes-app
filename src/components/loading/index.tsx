import {CircularProgress, Typography} from "@mui/material";
import styled from "styled-components";

const LoadingMask = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    z-index: 10;
    background-color: rgba(200, 200, 200, 0.4);
`

export const Loading = ({text = ''}: { text?: string }) =>
    <LoadingMask className='loading'>
        <div>
            <div>
                <CircularProgress color="primary"/>
            </div>
            {!!text && <Typography variant='subtitle1' style={{marginLeft: '0.5em'}} component='div'>{text}</Typography>}
        </div>


    </LoadingMask>
