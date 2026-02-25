import { defineConfig } from 'vite'

export default defineConfig({
  mode: 'production',
  build: {
    target: 'node18',
    emptyOutDir: false,
    reportCompressedSize: false,
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [/^node:/, 'child_process'],
    },
  },
})
