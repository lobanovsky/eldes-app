import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {styled} from "@mui/material";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {SnackbarProvider} from 'notistack';

import {AppHeader, AppFooter} from "components/layout";
import {Loading} from "components/loading";
import {Container, FlexBox} from "components/styled";
import {getAuth} from "store/auth/selectors";
import {logout} from "store/auth/reducer";
import {EldesController} from "views/eldes";
import {onSuccessLoadUser} from "views/auth/login/helpers";
import {LoginView} from 'views/auth/login';
import './App.css';
import {IS_DEBUG} from "utils/constants";
import {getMobileOperatingSystem} from "./utils/utils";
import {useNotifications} from "./hooks";


const theme = createTheme({
    colorSchemes: {
        // dark: true,
    },
    palette: {
        // mode: 'dark',
    },
});

const ViewContainer = styled(Container)`
    flex: 1 0 auto;
    //72px  высота хедера
    // 56px высота футера
    max-height: calc(100vh - 72px);
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
    const {showMessage} = useNotifications();
    const {
        user,
        isLoggingIn,
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

    useEffect(() => {
        if (isUserLoggedIn && !isCheckingToken && !isLoggingIn) {
            const userOS = getMobileOperatingSystem();
            if (user.user.email === 'ifsogirl91@gmail.com') {
                showMessage(`User device: [${userOS}]`);
            }
        }

    }, [isUserLoggedIn, user?.user.email, isLoggingIn, isCheckingToken]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <div className="App" style={{backgroundColor: '#F6F0F0'}}>
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
