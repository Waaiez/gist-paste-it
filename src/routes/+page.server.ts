import { error, invalid, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const data = await request.formData();

		const title = data.get('title') as string;
		const content = data.get('content') as string;
		const languageSelected = data.get('languageSelection') as string;

		const pasteData = { title, content, languageSelected };

		const response = await fetch('/api/gists/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(pasteData)
		});

		if (response.status !== 302) {
			if (response.status === 500) {
				throw error(500, response.statusText);
			}
			return invalid(response.status, { invalid: true, message: response.statusText });
		}

		if (response.status === 302) throw redirect(303, `/${response.statusText}`);

		return invalid(500, {
			invalid: true,
			message: 'Something went wrong'
		});
	}
};
