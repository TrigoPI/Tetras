import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		noExternal: process.env.NODE_ENV === 'production' ? ['@carbon/charts'] : []
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
