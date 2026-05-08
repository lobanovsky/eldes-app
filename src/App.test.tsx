import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/es/integration/react';
import { SnackbarProvider } from 'notistack';
import App from './App';
import store, { persistor } from './store';

test('renders the login form for unauthenticated users', async () => {
  render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  );

  expect(await screen.findByText('Вход в систему')).toBeInTheDocument();
});
