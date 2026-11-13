import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/es/integration/react';
import { SnackbarProvider } from 'notistack';
import App from './App';
import store, { persistor } from './store';

test('renders the login form for unauthenticated users', async () => {
  const saved = new Map<string, string>();
  Object.defineProperty(window, 'localStorage', {configurable: true, value: {
    getItem: (key: string) => saved.get(key) ?? null,
    setItem: (key: string, value: string) => saved.set(key, value),
    removeItem: (key: string) => saved.delete(key),
  }});
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

  fireEvent.click(screen.getByRole('button', {name: 'Включить тёмную тему'}));
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  expect(JSON.parse(window.localStorage.getItem('eldes-theme') || '{}').guest).toBe('dark');

  fireEvent.click(screen.getByRole('button', {name: 'Включить светлую тему'}));
  expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  expect(JSON.parse(window.localStorage.getItem('eldes-theme') || '{}').guest).toBe('light');
});
