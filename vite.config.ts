import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    envPrefix: ['VITE_', 'REACT_APP_'],
    build: {
      outDir: 'build',
    },
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        components: '/src/components',
        hooks: '/src/hooks',
        store: '/src/store',
        utils: '/src/utils',
        views: '/src/views',
        backend: '/src/backend',
        services: '/src/services',
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version ?? ''),
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      globals: true,
    },
  };
});
