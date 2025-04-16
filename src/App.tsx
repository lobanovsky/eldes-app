import React from 'react';
import axios from "axios";
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
        dark: true,
    },
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider>
                <CssBaseline/>
                <div className="App">
                    <EldesController/>
                </div>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
