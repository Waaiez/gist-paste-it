/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/@brainandbones/skeleton/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			fontFamily: {
				mono: ['Fira Mono', 'monospace']
			}
		}
	},
	plugins: [
		require('tailwind-scrollbar'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('@brainandbones/skeleton/tailwind/theme.cjs')
	]
};
