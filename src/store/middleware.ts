import { authMiddleware } from './auth/middleware';

export const storeMiddleware = (getDefaultMiddleware: any) => getDefaultMiddleware({
    serializableCheck: false
})
    .prepend(
        authMiddleware.middleware
    );
