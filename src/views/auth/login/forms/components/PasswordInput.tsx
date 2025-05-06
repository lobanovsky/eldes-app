import {IconButton, InputAdornment, TextField, TextFieldProps} from "@mui/material";
import {useCallback, useState} from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {FormInput} from "components/styled";

export const PasswordInput = (inputProps: TextFieldProps) => {
    const [isShownPassword, setShowPassword] = useState(false);

    const togglePassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    return <FormInput
        {...inputProps}
        type={isShownPassword ? 'text' : 'password'}
        slotProps={{
            input: {
                endAdornment: <InputAdornment position="end">
                    <IconButton
                        aria-label={
                            isShownPassword ? 'Скрыть пароль' : 'Показать пароль'
                        }
                        onClick={togglePassword}
                        edge="end"
                    >
                        {isShownPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                    </IconButton>
                </InputAdornment>
            },
        }}
    />
};
