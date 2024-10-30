import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		alias: {
			$lib: '/src/lib',
			$types: '/src/types'
		},
		clearMocks: true,
		environment: 'node',
		include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
		restoreMocks: true
	}
});
