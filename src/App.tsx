import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, CircularProgress, Container, styled} from "@mui/material";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {SnackbarProvider} from 'notistack';

import {getAuth} from "store/auth/selectors";
import {logout} from "store/auth/reducer";
import {EldesController} from "views/eldes";
import {onSuccessLoadUser} from "views/auth/login/helpers";
import {LoginView} from 'views/auth/login';
import './App.css';
import {IS_DEBUG} from "./utils/constants";
import axios from "axios";
import {Loading} from "./components/loading";
import {AuthDebugButtons} from "./components/auth/DebugButtons";

const theme = createTheme({
    colorSchemes: {
        // dark: true,
    },
    palette: {
        // mode: 'dark',
    },
});

const StyledContainer = styled(Container)`
    padding: 1em 1em;
    height: 100%;
`

function App() {
    const dispatch = useDispatch();
    const auth = useSelector(getAuth);
    const {
        user,
        isUserLoggedIn,
        isCheckingToken
    } = auth;

    useEffect(() => {
        if (isUserLoggedIn) {
            // todo нет реста для получения данных пользователя (проверки токена), поэтому сразу саксесс
            onSuccessLoadUser(user);
        } else {
            dispatch(logout());
        }

    }, []);

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider autoHideDuration={3000}>
                <CssBaseline/>
                <div className="App" style={{backgroundColor: '#F6F0F0', position: 'relative'}}>
                    {/*<AppHeader/>*/}
                    <AuthDebugButtons/>
                    <StyledContainer className="app-content" style={{paddingBottom: '2em'}}>
                        {isCheckingToken && <Loading/>}
                        {/*@ts-ignore*/}
                        {isUserLoggedIn && user?.token && !isCheckingToken ? <EldesController/> : <LoginView/>}
                    </StyledContainer>
                </div>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
