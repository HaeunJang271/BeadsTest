import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages: 저장소명이 BeadsTest이면 base는 '/BeadsTest/'
 * 로컬만 쓸 때는 '/'로 바꿔도 된다.
 */
export default defineConfig({
  plugins: [react()],
  base: '/BeadsTest/',
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
  },
});
