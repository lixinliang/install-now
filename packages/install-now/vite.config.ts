import { defineConfig } from 'vite'

export default defineConfig({
  mode: 'production',
  build: {
    target: 'node18',
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [/^node:/],
    },
  },
})
