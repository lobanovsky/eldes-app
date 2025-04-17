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
        primary: {
            main: '#a5d6a7', // Pastel green
        },
        secondary: {
            main: '#b39ddb', // Pastel purple
        },
        success: {
            main: '#c5e1a5', // Pastel light green
        },
        warning: {
            main: '#ffe0b2', // Pastel orange
        },
        error: {
            main: '#ffcdd2', // Pastel red
        },
        info: {
            main: '#b3e5fc', // Pastel blue
        },
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
                    <StyledContainer className="footer" style={{padding: '0.5em 0'}}>
                        Сделано в
                        {' '}
                        <a href="https://lobanovsky.ru" style={{ textDecoration: 'none', color: '#1976d2' }}>Бюро Лобановского</a>
                        <span style={{color: 'red', marginLeft: '0.5em'}}>♡</span>
                    </StyledContainer>
                    <StyledContainer className="app-content" style={{height: 'calc(100vh - 64px)'}}>
                        <EldesController/>
                    </StyledContainer>
                </div>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
