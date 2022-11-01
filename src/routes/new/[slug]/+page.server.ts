import type { PageServerLoad, Actions } from './$types';
import { nanoid } from 'nanoid';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { Gist } from '@prisma/client';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { slug } = params;

	const response = await fetch(`/api/gists/retrieve/${slug}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		throw error(response.status, response.statusText);
	}

	const { gist }: { gist: Gist } = await response.json();

	return {
		gist
	};
};

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
