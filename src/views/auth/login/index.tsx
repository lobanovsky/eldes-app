import React, { useCallback, useState} from 'react';

import {FlexBox} from "components/styled";
import {RegistrationForm} from './forms/registration';
import {LoginForm} from "./forms/login";
import {ResetPasswordForm} from "./forms/reset-password";

type LoginFormType = 'LOGIN' | "REGISTER" | 'RESET_PASSWORD';


export function LoginView() {
    const [formType, setFormType] = useState<LoginFormType>("LOGIN");
    const showRegistration = useCallback(() => {
        setFormType('REGISTER');
    }, []);

    const showResetPassword = useCallback(() => {
        setFormType('RESET_PASSWORD');
    }, []);

    const showLogin = useCallback(() => {
        setFormType('LOGIN');
    }, []);

    return (
        <div className="view login" style={{height: '100%'}}>
            {/*@ts-ignore*/}
            <FlexBox justifyContent="center" height='100%'>
                {/*@ts-ignore*/}
                {formType === 'LOGIN' &&
                    <LoginForm  showRegistration={showRegistration} showResetPassword={showResetPassword}/>}
                {formType === 'REGISTER' && <RegistrationForm showLogin={showLogin}/>}
                {formType === 'RESET_PASSWORD' && <ResetPasswordForm showLogin={showLogin}/>}
            </FlexBox>
        </div>
    );
}
