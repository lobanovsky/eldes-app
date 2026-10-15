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
        mode: 'light',
        primary: {
            main: '#3568ad',
            dark: '#254e85',
            light: '#eaf1fb',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#64748b',
        },
        background: {
            default: '#f4f6fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#233247',
            secondary: '#64748b',
        },
        divider: '#e2e8f0',
    },
    shape: {
        borderRadius: 12,
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
                    borderRadius: 12,
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
                    borderRadius: 20,
                    backgroundImage: 'none',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 32px rgba(35, 50, 71, 0.05)',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#52647c',
                    borderRadius: 12,
                    '&:hover': {
                        backgroundColor: 'rgba(53, 104, 173, 0.08)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8fafc',
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
    height: 100dvh;
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
