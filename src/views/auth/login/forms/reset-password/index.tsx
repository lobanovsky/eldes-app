import React, {ChangeEvent, useCallback, useMemo, useState} from "react";
import { Card, CardContent, Typography} from "@mui/material";
import axios, {AxiosResponse} from "axios";

import {FlexBox, FormInput, SimpleButton} from "components/styled";
import {useLoading, useNotifications} from "hooks";
import {EMPTY_USER_DATA} from "store/auth/reducer";
import {EmailRegex} from "utils/constants";
import {UserInfo, VoidFn} from "utils/types";


export const ResetPasswordForm = ({showLogin}: { showLogin: VoidFn }) => {
    const {showError, showMessage} = useNotifications();
    const [isLoading, showLoading, hideLoading] = useLoading();

    const [email, setEmail] = useState('');

    const isFormValid = useMemo(() => EmailRegex.test(email || ''), [email]);

    const restorePassword = useCallback(() => {
        showLoading();

        axios.post('/api/auth/recover-password', {email})
            // @ts-ignore
            .then(({
                       data: {message = ''} = {message: '', password: '', user: EMPTY_USER_DATA}
                   }: AxiosResponse<{ message: string, password: string, user: UserInfo }> = {}) => {
                showMessage(message || `Пароль отправлен на "${email}"`)
                hideLoading();
                showLogin();
            })
            .catch((err) => {
                hideLoading();
                showError('Не удалось зарегистрироваться', err);
            })
    }, [email]);

    const onChangeEmail = useCallback(({target: {value}}: ChangeEvent<HTMLInputElement>) => {
        setEmail(value);
    }, []);

    return (
        <Card style={{width: '100%', maxWidth: 400}}>
            <CardContent style={{height: '100%'}}>
                <Typography gutterBottom variant="h5" component="div">
                    Восстановление пароля
                </Typography>
                <div className='fields' style={{marginTop: '1em'}}>
                    <FormInput
                        required
                        disabled={isLoading}
                        error={!isFormValid}
                        label="Email"
                        type='email'
                        value={email}
                        onChange={onChangeEmail}
                    />
                </div>
                <FlexBox style={{marginTop: '2em'}}>
                    <SimpleButton
                        style={{width: '100%'}}
                        variant='contained'
                        onClick={restorePassword}
                        loading={isLoading}
                        disabled={!isFormValid}>
                        ОТПРАВИТЬ</SimpleButton>
                </FlexBox>
                <FlexBox style={{marginTop: '1em'}}>
                    <SimpleButton
                        variant='text'
                        onClick={showLogin}
                    >
                        Вернуться к форме входа</SimpleButton>
                </FlexBox>
            </CardContent>
        </Card>
    )
}
