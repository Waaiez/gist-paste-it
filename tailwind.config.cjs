const defaultTheme = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		require('path').join(require.resolve('@brainandbones/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Poppins', ...defaultTheme.fontFamily.sans],
				mono: ['Fira Mono', 'monospace']
			}
		}
	},
	plugins: [
		require('@tailwindcss/line-clamp'),
		require('tailwind-scrollbar'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('@brainandbones/skeleton/tailwind/theme.cjs')
	]
};
