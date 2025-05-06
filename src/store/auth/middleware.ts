import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { loginError } from './reducer';

export const authMiddleware = createListenerMiddleware();

authMiddleware.startListening({
    matcher: isAnyOf(loginError),
    effect: async () => {
        delete axios.defaults.headers.Authorization;
    }

});
