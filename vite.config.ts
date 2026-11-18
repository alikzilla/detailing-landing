import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Default 5180 avoids the old cached app on localhost:5173; a PORT env var overrides it.
const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};

export default defineConfig({
  plugins: [react()],
  server: { port: Number(env.PORT) || 5180 },
});
