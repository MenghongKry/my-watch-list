import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { config } from 'dotenv';

// Load the test settings (DB_NAME=watchlist_test) so e2e tests never touch the real database.
// ConfigModule keeps values that are already in process.env, so these win over .env.
const testEnv = config({ path: '.env.test' }).parsed ?? {};

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['test/**/*.e2e-spec.ts'],
    env: testEnv,
    // Run the e2e files one at a time, because they share the same test database
    fileParallelism: false,
  },
});
