import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {PersistGate} from 'reduxjs-toolkit-persist/es/integration/react';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import store, {persistor} from './store';
import {SnackbarProvider} from "notistack";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SnackbarProvider autoHideDuration={3000} maxSnack={5}>
                <App/>
                </SnackbarProvider>
            </PersistGate>
        </Provider>
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
