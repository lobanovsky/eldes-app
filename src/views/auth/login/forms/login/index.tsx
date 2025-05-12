import React, {ChangeEvent, KeyboardEvent, useCallback, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Card, CardContent, Typography} from "@mui/material";

import {FlexBox, FormInput, SimpleButton} from "components/styled";
import {useNotifications} from "hooks";
import {getAuth} from "store/auth/selectors";
import {EmailRegex} from "utils/constants";
import {VoidFn} from "utils/types";
import {PasswordInput} from "../components/PasswordInput";
import {performLogin} from "../../services";


export const LoginForm = ({showRegistration, showResetPassword, savedPassword = ''}: {
    showRegistration: VoidFn,
    showResetPassword: VoidFn,
    savedPassword?: string
}) => {
    const {user: {loginEmail = '', loginPassword = ''}, isLoggingIn} = useSelector(getAuth);
    const dispatch = useDispatch();

    const { showError} = useNotifications();
    const [credentials, setCredentials] = useState<{ email: string, password: string }>(() => {
        return ({
            email: loginEmail,
            password: loginPassword
        });
    });

    const formValidState = useMemo(() => ({
        email: EmailRegex.test(credentials.email || ''),
        password: !!(credentials.password || '').length
    }), [credentials.email, credentials.password]);

    const doLogin = useCallback(() => {
        performLogin(credentials, dispatch, showError);
    }, [credentials.email, credentials.password]);

    const onChangeEmail = useCallback(({target: {value}}: ChangeEvent<HTMLInputElement>) => {
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            email: value
        }));
    }, []);

    const onChangePassword = useCallback(({target: {value}}: ChangeEvent<HTMLInputElement>) => {
        const pwdWithoutSpaces = value.replace(/\s+/g, '');
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            password: pwdWithoutSpaces
        }));
    }, []);

    const onLoginFormClick = useCallback((ev: KeyboardEvent) => {
        const isEnterKeyPressed = ev.keyCode === 13 || String(ev.key)
            .toLowerCase() === 'enter';
        if (isEnterKeyPressed && formValidState.email && formValidState.password) {
            doLogin();
        }
    }, [doLogin, formValidState.email, formValidState.password]);

    return (
        <Card style={{width: '100%', maxWidth: 400}} onKeyDown={onLoginFormClick}>
            <CardContent style={{height: '100%'}}>
                <Typography gutterBottom variant="h5" component="div">
                    Вход в систему
                </Typography>
                <div className='fields' style={{marginTop: '1em'}}>
                    <FormInput
                        required
                        error={!formValidState.email}
                        label="Email"
                        type='email'
                        value={credentials.email}
                        onChange={onChangeEmail}
                    />
                    <PasswordInput
                        required
                        error={!formValidState.password}
                        label="Пароль"
                        value={credentials.password}
                        onChange={onChangePassword}
                    />
                </div>
                <FlexBox style={{marginTop: '1em'}}>
                    <SimpleButton
                        style={{width: '100%'}}
                        variant='contained'
                        onClick={doLogin}
                        disabled={!formValidState.email || !formValidState.password}>
                        ВОЙТИ</SimpleButton>
                </FlexBox>
                <FlexBox flex-direction={'row'} style={{marginTop: '1em'}} justify-content='space-between'>
                    <SimpleButton
                        variant='text'
                        onClick={showResetPassword}
                        disabled={isLoggingIn}>
                        Забыли пароль?</SimpleButton>
                    <SimpleButton
                        variant='text'
                        onClick={showRegistration}
                        disabled={isLoggingIn}>
                        Регистрация</SimpleButton>
                </FlexBox>
            </CardContent>
        </Card>
    )
}
