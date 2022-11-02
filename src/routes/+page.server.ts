import { nanoid } from 'nanoid';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const data = await request.formData();

		const title = data.get('title') as string;
		const content = data.get('content') as string;
		const languageSelected = data.get('languageSelection') as string;
		const slug = nanoid(6);

		const pasteData = { title, content, languageSelected, slug };

		const response = await fetch('/api/gists/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(pasteData)
		});

		if (!response.ok) {
			if (response.status === 500) {
				throw error(500, response.statusText);
			}
			return invalid(response.status, { invalid: true, message: response.statusText });
		}

		if (response.status === 201) throw redirect(303, `/${slug}`);

		return invalid(500, {
			invalid: true,
			message: 'Something went wrong'
		});
	}
};
