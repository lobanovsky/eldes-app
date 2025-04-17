import React from 'react';
import axios from "axios";
import {Button, Container, styled} from "@mui/material";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import {SnackbarProvider} from 'notistack';
import {EldesController} from "./views/eldes";

import './App.css';


axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
// axios.defaults.proxy = {
//     host: '109.173.116.61',
//     port: 8070
// }
const theme = createTheme({
    colorSchemes: {
        // dark: true,
    },
    palette: {
        // mode: 'dark',
    },
});

const StyledContainer = styled(Container)`
    padding: 1em 1em`

function App() {
    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider>
                <CssBaseline/>
                <div className="App">
                    <StyledContainer className="app-content" style={{height: 'calc(100vh - 64px)'}}>
                        <EldesController/>
                    </StyledContainer>
                    <StyledContainer className="footer">
                        сделано в
                        {' '}
                        <Button size="small" href="https://lobanovsky.ru">Бюро Лобановского</Button>
                        ♡
                    </StyledContainer>
                </div>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
