import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {styled} from "@mui/material";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import {AppHeader} from "components/layout";
import {Loading} from "components/loading";
import {Container, FlexBox} from "components/styled";
import {getAuth} from "store/auth/selectors";
import {logout} from "store/auth/reducer";
import {EldesController} from "views/eldes";
import {onSuccessLoadUser} from "views/auth/login/helpers";
import {LoginView} from 'views/auth/login';
import './App.css';
import {IS_DEBUG} from "utils/constants";


const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#8ea4c8',
            dark: '#61799f',
            light: '#bac9e2',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#9aa4b2',
        },
        background: {
            default: '#0f141b',
            paper: '#161d27',
        },
        text: {
            primary: '#eef2f7',
            secondary: '#9aa4b2',
        },
        divider: '#2b3544',
    },
    shape: {
        borderRadius: 8,
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        button: {
            textTransform: 'none',
            fontWeight: 700,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: 'none',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    backgroundImage: 'none',
                    boxShadow: '0 18px 44px rgba(0, 0, 0, 0.32)',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#d7deea',
                    borderRadius: 8,
                    '&:hover': {
                        backgroundColor: 'rgba(142, 164, 200, 0.12)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#111821',
                    },
                },
            },
        },
    },
});

const ViewContainer = styled(Container)`
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
`

const Layout = styled(FlexBox)`
    height: 100vh;
    justify-content: flex-start;
    gap: 0;
    flex-direction: column;
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
            <CssBaseline/>
            <div className="App">
                {isCheckingToken && <Loading/>}
                <Layout style={IS_DEBUG ? {background: '#f48ca7'} : {}}>
                    <AppHeader/>
                    <ViewContainer className="app-content">
                        {isUserLoggedIn && user?.token && !isCheckingToken ? <EldesController/> : <LoginView/>}
                    </ViewContainer>
                    {/*<AppFooter/>*/}
                </Layout>

            </div>
        </ThemeProvider>
    );
}

export default App;
