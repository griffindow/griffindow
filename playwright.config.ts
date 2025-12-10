import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI
		? [['html'], ['github'], ['json', { outputFile: 'test-results.json' }]]
		: 'html',
	use: {
		baseURL: process.env.BASE_URL || 'http://localhost:4173',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		// Increase timeout for CI environment
		actionTimeout: process.env.CI ? 10000 : 5000,
		navigationTimeout: process.env.CI ? 30000 : 10000
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	],
	webServer: process.env.BASE_URL
		? undefined
		: {
				command: 'npm run build && npm run preview',
				port: 4173,
				reuseExistingServer: !process.env.CI
			}
});
