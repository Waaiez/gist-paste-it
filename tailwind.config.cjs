const defaultTheme = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Poppins', ...defaultTheme.fontFamily.sans],
				mono: ['Fira Mono', ...defaultTheme.fontFamily.mono]
			}
		}
	},
	plugins: [
		require('@tailwindcss/line-clamp'),
		require('tailwind-scrollbar'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()
	]
};
