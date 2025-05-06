import React, {ChangeEvent, KeyboardEvent, useCallback, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Card, CardContent, Typography} from "@mui/material";
import axios from "axios";
import {useSnackbar} from "notistack";

import {FlexBox, FormInput, LowercasedButton} from "components/styled";
import {useLoading} from "hooks/use-loading";
import {loginError, loginStarted} from "store/auth/reducer";
import {EmailRegex} from "utils/constants";
import {VoidFn} from "utils/types";
import {getAuth} from "store/auth/selectors";
import {onSuccessLoadUser} from "../../helpers";
import {PasswordInput} from "../components/PasswordInput";


export const LoginForm = ({showRegistration, showResetPassword, savedPassword = ''}: { showRegistration: VoidFn, showResetPassword: VoidFn, savedPassword?: string }) => {
    const authState = useSelector(getAuth);
    const dispatch = useDispatch();

    const {enqueueSnackbar} = useSnackbar();
    const [loading, showLoading, hideLoading] = useLoading();
    const [credentials, setCredentials] = useState<{ email: string, password: string }>(() => {
        return ({
            email: '',
            password: authState.user.loginPassword || ''
        });
    });

    const formValidState = useMemo(() => ({
        email: EmailRegex.test(credentials.email || ''),
        password: !!(credentials.password || '').length
    }), [credentials.email, credentials.password]);

    const doLogin = useCallback(() => {
        dispatch(loginStarted());
        showLoading();
        axios.post('/api/auth/login', {
            email: credentials.email,
            password: credentials.password,
        })
            // @ts-ignore
            .then(({data = {}} = {}) => {
                onSuccessLoadUser(data);
                hideLoading();
            })
            .catch((err) => {
                hideLoading();
                const errorMsg = JSON.stringify(err.message || err.error || err.response);
                enqueueSnackbar(errorMsg, {variant: 'error'})
                dispatch(loginError());
            })
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
        <Card style={{width: 400}} onKeyDown={onLoginFormClick}>
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
                <FlexBox style={{marginTop: '2em'}}>
                    <Button
                        style={{width: '100%'}}
                        variant='contained'
                        onClick={doLogin}
                        disabled={!formValidState.email || !formValidState.password}>
                        Войти</Button>
                </FlexBox>
                <FlexBox flex-direction={'row'} style={{marginTop: '1em'}} justifyContent='space-between'>
                    <LowercasedButton
                        variant='text'
                        // onClick={doLogin}
                        // disabled={!formValidState.email || !formValidState.password}>
                    >
                        Забыли пароль?</LowercasedButton>
                    <LowercasedButton
                        variant='text'
                        onClick={showRegistration}
                        // disabled={!formValidState.email || !formValidState.password}>
                    >
                        Регистрация</LowercasedButton>
                </FlexBox>
            </CardContent>
        </Card>
    )
}
