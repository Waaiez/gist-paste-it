import { retrieveGist } from '$lib/gistActions';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
