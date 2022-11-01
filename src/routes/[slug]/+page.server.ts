import type { Gist } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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

	const numberOfLines = gist.content.split('\n').length;

	return {
		gist,
		numberOfLines
	};
};
