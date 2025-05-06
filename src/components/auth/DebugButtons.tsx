import {FlexBox} from "../styled";
import {useDispatch, useSelector} from "react-redux";
import {getAuth} from "../../store/auth/selectors";
import axios from "axios";
import {logout} from "../../store/auth/reducer";
import {Button, IconButton} from "@mui/material";
import React from "react";
import LogoutIcon from '@mui/icons-material/Logout';

export const AuthDebugButtons = () => {
    const {
        user,
        isUserLoggedIn,
        isCheckingToken
    } = useSelector(getAuth);

    const dispatch = useDispatch();

    return user.user.id > 0 && !isCheckingToken && isUserLoggedIn  ?  <div style={{position: 'absolute', top: '0.5em', right: '0.5em', width: 200, textAlign: 'end'}}>
        {user.user.email === 'ifsogirl91@gmail.com' && <Button
            variant="contained"
            size='small'
            color="primary"
            onClick={() => {
                axios.delete(`api/private/users/${user.user.id}`)
                    .then(r => {
                        dispatch(logout());
                    })
                    .catch(e => {
                        console.error(e);
                    })
            }}>
            Удалить себя
        </Button>}
        <IconButton aria-label="Выйти" onClick={() => {
            dispatch(logout());
        }}>
            <LogoutIcon/>
        </IconButton>
    </div> : <></>
}
