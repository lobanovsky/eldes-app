import React from 'react';
import axios from "axios";
import {Button, Container, styled} from "@mui/material";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import {SnackbarProvider} from 'notistack';
import {EldesController} from "./views/eldes";

import './App.css';
import {AppHeader} from "./components/layout/header";


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
                    <AppHeader/>
                    <StyledContainer className="app-content" style={{paddingBottom: '2em'}}>
                        <EldesController/>
                    </StyledContainer>

                </div>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
