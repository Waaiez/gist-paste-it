import type { Paste } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
