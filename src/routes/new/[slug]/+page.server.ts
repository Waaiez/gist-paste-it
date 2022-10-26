import type { PageServerLoad } from './$types';
import { nanoid } from 'nanoid';
import { error, invalid, redirect } from '@sveltejs/kit';
import { createGist, retrieveGist } from '$lib/gistActions';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	const response = await retrieveGist(slug);

	if (!response.success) {
		throw error(response.statusCode, response.message);
	}

	if (response.statusCode === 200)
		return {
			gist: response.data.gist,
			numOfLines: response.data.numOfLines
		};

	throw error(404, 'Gist not found');
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const title = data.get('title') as string;
		const content = data.get('content') as string;
		const slug = nanoid(6);

		const results = await createGist(title, content, slug);

		if (!results.success) {
			if (results.statusCode === 500) {
				throw error(500, results.message);
			}

			return invalid(results.statusCode, {
				invalid: true,
				message: results.message,
				data: results.data
			});
		}

		if (results.statusCode === 201) throw redirect(303, `/${slug}`);

		return invalid(500, {
			invalid: true,
			message: 'Something went wrong',
			data: { title: '', content: '' }
		});
	}
};
