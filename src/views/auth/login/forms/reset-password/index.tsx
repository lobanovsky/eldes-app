import React, {ChangeEvent, forwardRef, KeyboardEvent, useCallback, useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {Button, Card, CardContent, TextFieldProps, Typography} from "@mui/material";
import axios, {AxiosResponse} from "axios";
import {useSnackbar} from "notistack";

import {FlexBox, FormInput, SimpleButton} from "components/styled";
import {useLoading} from "hooks/use-loading";
import { EMPTY_USER_DATA} from "store/auth/reducer";
import {EmailRegex} from "utils/constants";
import {UserInfo, VoidFn} from "utils/types";
import {getErrorMessage} from "../../../../../utils/notifications";


export const ResetPasswordForm = ({showLogin}: { showLogin: VoidFn }) => {
    const {enqueueSnackbar} = useSnackbar();
    const [isLoading, showLoading, hideLoading] = useLoading();

    const [email, setEmail] = useState('');

    const isFormValid = useMemo(() =>EmailRegex.test(email || ''), [email]);

    const restorePassword = useCallback(() => {
        showLoading();
        axios.post('/api/auth/recover-password', {
            email
        })
            // @ts-ignore
            .then(({
                       data: {message = '', password = '', user} = {
                           message: '', password: '', user: EMPTY_USER_DATA
                       }
                   }: AxiosResponse<{ message: string, password: string, user: UserInfo }> = {}) => {
                let msg = message || `Пароль отправлен на "${email}"`;
                enqueueSnackbar(msg, {variant: 'success'});
                hideLoading();
                showLogin();
            })
            .catch((err) => {
                hideLoading();
                enqueueSnackbar(getErrorMessage('Не удалось зарегистрироваться', err), {variant: 'error'})
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
