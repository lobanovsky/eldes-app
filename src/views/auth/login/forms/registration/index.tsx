import React, {ChangeEvent, KeyboardEvent, useCallback, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Card, CardContent, Typography} from "@mui/material";
import axios, {AxiosResponse} from "axios";

import {FlexBox, FormInput, SimpleButton} from "components/styled";
import {useNotifications,useLoading} from "hooks";
import { EMPTY_USER_DATA, loginPasswordGenerated} from "store/auth/reducer";
import { getIsLoggingIn} from "store/auth/selectors";

import {EmailRegex} from "utils/constants";
import {UserInfo, VoidFn} from "utils/types";
import {TextMaskCustom} from "../components/MaskedInput";
import {performLogin} from "../../services";



const PhoneRegex = /^\+7\(\d{3}\)(\s?)\d{3}(\s?)\d{2}(\s?)\d{2}$/;

export const RegistrationForm = ({showLogin}: { showLogin: VoidFn }) => {
    const dispatch = useDispatch();
    const { showError, showMessage} = useNotifications();
    const [isLoading, showLoading, hideLoading] = useLoading();
    const isLoggingIn = useSelector(getIsLoggingIn);

    const [credentials, setCredentials] = useState<{ email: string, phoneNumber: string }>({
        email: '',
        phoneNumber: ''
    });

    const formValidState = useMemo(() => {
        return ({
            email: EmailRegex.test(credentials.email || ''),
            phoneNumber: PhoneRegex.test(credentials.phoneNumber || ''),
        })
    }, [credentials.email, credentials.phoneNumber]);


    const doRegister = useCallback(() => {
        showLoading();
        axios.post('/api/auth/register', {
            email: credentials.email,
            phoneNumber: credentials.phoneNumber,
        })
            // @ts-ignore
            .then(({
                       data: {message = '', password = '', user} = {
                           message: '', password: '', user: EMPTY_USER_DATA
                       }
                   }: AxiosResponse<{ message: string, password: string, user: UserInfo }> = {}) => {
              //после успешной регистрации сразу логинимся
                let msg = message || 'Вы успешно зарегистрировались!';
                if (password) {
                    msg = `Вы успешно зарегистрировались. Ваш пароль: ${password}. Также мы прислали его на вашу почту.`
                }
                showMessage(msg, { autoHideDuration: password ? 10000 : 3000});
                // hideLoading();
                dispatch(loginPasswordGenerated({password, email: user.email}));
                performLogin({
                    email: credentials.email,
                    password
                }, dispatch, showError, (isSuccess) => {
                    if (!isSuccess) {
                        hideLoading();
                        showLogin();
                    }
                });

            })
            .catch((err) => {
                hideLoading();
                showError('Не удалось зарегистрироваться', err);
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
            doRegister();
        }
    }, [doRegister, formValidState.email, formValidState.phoneNumber]);


    return (
        <Card style={{width: '100%', maxWidth: 400}} onKeyDown={onFormClick}>
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
                        slotProps={{
                            input: {
                                inputComponent: TextMaskCustom as any
                            },
                        }}
                    />
                </div>
                <FlexBox style={{marginTop: '2em'}}>
                    <SimpleButton
                        style={{width: '100%'}}
                        variant='contained'
                        onClick={doRegister}
                        loading={isLoading || isLoggingIn}
                        disabled={!formValidState.email || !formValidState.phoneNumber}>
                        ЗАРЕГИСТРИРОВАТЬСЯ</SimpleButton>
                </FlexBox>
                <FlexBox style={{marginTop: '1em'}}>
                    <SimpleButton
                        variant='text'
                        onClick={showLogin}
                    >
                        Уже есть учётная запись? Войти</SimpleButton>
                </FlexBox>
            </CardContent>
        </Card>
    )
}
