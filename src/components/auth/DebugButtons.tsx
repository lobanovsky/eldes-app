import {useDispatch, useSelector} from "react-redux";
import {getAuth} from "../../store/auth/selectors";
import axios from "axios";
import {logout} from "../../store/auth/reducer";
import {IconButton} from "@mui/material";
import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';

export const AuthDebugButtons = () => {
    const {user, isUserLoggedIn, isCheckingToken} = useSelector(getAuth);
    const dispatch = useDispatch();

    if (user.user.email !== 'ifsogirl91@gmail.com' || isCheckingToken || !isUserLoggedIn) {
        return null;
    }

    return (
        <IconButton style={{position: 'absolute', top: 48, right: 4}} onClick={() => {
            axios.delete(`api/private/users/${user.user.id}`)
                .then(() => dispatch(logout()))
                .catch(e => console.error(e));
        }}>
            <DeleteIcon/>
        </IconButton>
    );
}
