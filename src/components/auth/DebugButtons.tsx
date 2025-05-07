import {FlexBox} from "../styled";
import {useDispatch, useSelector} from "react-redux";
import {getAuth} from "../../store/auth/selectors";
import axios from "axios";
import {logout} from "../../store/auth/reducer";
import {Button, IconButton} from "@mui/material";
import React from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';

export const AuthDebugButtons = () => {
    const {
        user,
        isUserLoggedIn,
        isCheckingToken
    } = useSelector(getAuth);

    const dispatch = useDispatch();

    return <div style={{width: 42, textAlign: 'end', position: 'relative'}}>
        {user.user.id > 0 && !isCheckingToken && isUserLoggedIn ? <>
            {user.user.email === 'ifsogirl91@gmail.com' &&
                <IconButton aria-label="Выйти" style={{position: 'absolute', top: 48, right: 4}} onClick={() => {
                    axios.delete(`api/private/users/${user.user.id}`)
                        .then(r => {
                            dispatch(logout());
                        })
                        .catch(e => {
                            console.error(e);
                        })
                }}>
                    <DeleteIcon/>
                </IconButton>
            }
            <IconButton aria-label="Выйти" onClick={() => {
                dispatch(logout());
            }}>
                <LogoutIcon/>
            </IconButton>
        </> : <></>}
    </div>


}
