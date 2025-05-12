import { StoreState } from '../index';
import {AuthStoreState} from "./reducer";


export const getAuth = ({ auth }: StoreState):AuthStoreState => auth;
export const getIsLoggingIn = ({ auth }: StoreState):boolean => auth.isLoggingIn;
export const getUser = (state: StoreState) => state.auth.user;
