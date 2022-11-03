import type { PageServerLoad, Actions } from './$types';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { Paste } from '@prisma/client';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { slug } = params;

	const response = await fetch(`/api/pastes/retrieve/${slug}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		throw error(response.status, response.statusText);
	}

	const { paste }: { paste: Paste } = await response.json();

	return {
		paste
	};
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const data = await request.formData();

		const title = data.get('title') as string;
		const content = data.get('content') as string;
		const languageSelected = data.get('languageSelection') as string;

		const pasteData = { title, content, languageSelected };

		const response = await fetch('/api/pastes/create', {
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
