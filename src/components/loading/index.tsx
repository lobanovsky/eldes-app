import {CircularProgress} from "@mui/material";
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
    background-color: rgba(255, 255, 255, 0.4);
`

export const Loading = () =>
    <LoadingMask>
        <CircularProgress color="primary"/>
    </LoadingMask>
