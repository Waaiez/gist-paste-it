import prisma from '$lib/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;
	try {
		const gist = await prisma.gist.findUnique({
			where: {
				slug
			}
		});

		if (!gist) {
			throw error(404, 'Gist not found');
		}

		return gist;
	} catch (e) {
		if (typeof e === 'string') {
			throw error(500, e.toUpperCase());
		} else if (e instanceof Error) {
			throw error(500, e.message);
		}
	}

	throw error(404, 'Not found');
};
