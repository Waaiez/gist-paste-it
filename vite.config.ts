import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	define: {
		_a: 'undefined'
	},
	optimizeDeps: {
		include: ['highlight.js', 'highlight.js/lib/core']
	}
};

export default config;
