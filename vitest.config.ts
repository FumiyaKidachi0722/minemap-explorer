// vitest.config.ts
import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'react-icons/ci': path.resolve(
        __dirname,
        'src/presentation/components/icons/react-icons-ci.tsx'
      ),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'istanbul',
      reporter: ['text'],
      all: true,
      include: [
        'src/app/api/**/*.ts',
        'src/presentation/**/*.tsx',
        'src/infrastructure/**/*.ts',
        'src/application/**/*.ts',
      ],
      exclude: ['src/presentation/components/ui/**', 'src/**/__tests__/**'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
