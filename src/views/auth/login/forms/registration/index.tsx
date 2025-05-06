import React, {ChangeEvent, forwardRef, KeyboardEvent, useCallback, useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {Button, Card, CardContent, TextFieldProps, Typography} from "@mui/material";
import axios, {AxiosResponse} from "axios";
import {useSnackbar} from "notistack";
import { InputMask, type InputMaskProps, useMask } from '@react-input/mask';

import {FlexBox, FormInput, LowercasedButton} from "components/styled";
import {useLoading} from "hooks/use-loading";
import {loginPasswordGenerated, loginStarted} from "store/auth/reducer";
import {EmailRegex} from "utils/constants";
import {UserInfo, VoidFn} from "utils/types";



export const RegistrationForm = ({showLogin}: { showLogin: VoidFn }) => {
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [isLoading, showLoading, hideLoading] = useLoading();
    // const inputRef = useMask({
    //     mask: '+0 (___) ___-__-__',
    //     replacement: { _: /\d/ },
    // });

    const [credentials, setCredentials] = useState<{ email: string, phoneNumber: string }>({
        email: '',
        phoneNumber: ''
    });

    const formValidState = useMemo(() => ({
        email: EmailRegex.test(credentials.email || ''),
        //todo валидация номера телефона; Возможно прикрутить маску
        phoneNumber: !!(credentials.phoneNumber || '').length
    }), [credentials.email, credentials.phoneNumber]);


    const doLogin = useCallback(() => {
        dispatch(loginStarted());
        showLoading();
        axios.post('/api/auth/register', {
            email: credentials.email,
            phoneNumber: credentials.phoneNumber,
        })
            // @ts-ignore
            .then(({data = {}}: AxiosResponse<{message: sttring, password: string, user: UserInfo}> = {}) => {
                let msg = data.message || 'Вы успешно зарегистрировались!';
                if (data.password) {
                    msg = `Вы успешно зарегистрировались. Ваш пароль: ${data.password}. Также мы прислали его на вашу почту.`
                }
                enqueueSnackbar(msg, {variant: 'success'})
                hideLoading();
                dispatch(loginPasswordGenerated(data.password));
                showLogin();
            })
            .catch((err) => {
                hideLoading();
                const errorMsg = JSON.stringify(err.message || err.error || err.response);
                enqueueSnackbar(errorMsg, {variant: 'error'})
            })
    }, [credentials.email, credentials.phoneNumber]);

    const onChangeEmail = useCallback(({target: {value}}: ChangeEvent<HTMLInputElement>) => {
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            email: value
        }));
    }, []);

    const onChangePhone = useCallback(({target: {value}}: ChangeEvent<HTMLInputElement>) => {
        const pwdWithoutSpaces = value.replace(/\s+/g, '');
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            phoneNumber: pwdWithoutSpaces
        }));
    }, []);

    const onFormClick = useCallback((ev: KeyboardEvent) => {
        const isEnterKeyPressed = ev.keyCode === 13 || String(ev.key)
            .toLowerCase() === 'enter';
        if (isEnterKeyPressed && formValidState.email && formValidState.phoneNumber) {
            doLogin();
        }
    }, [doLogin, formValidState.email, formValidState.phoneNumber]);


    return (
        <Card style={{width: 400}} onKeyDown={onFormClick}>
            <CardContent style={{height: '100%'}}>
                <Typography gutterBottom variant="h5" component="div">
                    Регистрация
                </Typography>
                <div className='fields' style={{marginTop: '1em'}}>
                    <FormInput
                        required
                        disabled={isLoading}
                        error={!formValidState.email}
                        label="Email"
                        type='email'
                        value={credentials.email}
                        onChange={onChangeEmail}
                    />
                    <FormInput
                        required
                        disabled={isLoading}
                        error={!formValidState.phoneNumber}
                        label="Номер телефона"
                        value={credentials.phoneNumber}
                        onChange={onChangePhone}
                    />
                    {/*<InputMask*/}
                    {/*    required*/}
                    {/*    disabled={isLoading}*/}
                    {/*    mask="+7(999)999 99 99"*/}
                    {/*    onChange={onChangePhone}*/}
                    {/*    value={credentials.phoneNumber}*/}
                    {/*    maskChar=" "*/}
                    {/*>*/}
                    {/*    {() => <FormInput label="Номер телефона"/>}*/}
                    {/*</InputMask>*/}
                    {/*<FormInput*/}
                    {/*    required*/}
                    {/*    disabled={isLoading}*/}
                    {/*    error={!formValidState.phoneNumber}*/}
                    {/*    label="Номер телефона"*/}
                    {/*    value={credentials.phoneNumber}*/}
                    {/*    onChange={onChangePhone}*/}
                    {/*/>*/}
                </div>
                <FlexBox style={{marginTop: '2em'}}>
                    <Button
                        style={{width: '100%'}}
                        variant='contained'
                        onClick={doLogin}
                        loading={isLoading}
                        disabled={!formValidState.email || !formValidState.phoneNumber}>
                        Зарегистрироваться</Button>
                </FlexBox>
                <FlexBox style={{marginTop: '1em'}}>
                    <LowercasedButton
                        variant='text'
                        onClick={showLogin}
                    >
                        Уже есть учётная запись? Войти</LowercasedButton>
                </FlexBox>
            </CardContent>
        </Card>
    )
}
