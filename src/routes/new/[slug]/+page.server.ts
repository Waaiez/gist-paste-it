import prisma from '$lib/db';
import type { PageServerLoad } from './$types';
import { nanoid } from 'nanoid';
import { error, invalid, redirect, type Actions } from '@sveltejs/kit';

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

		const numOfLines = gist.content.split('\n').length;

		return {
			gist,
			numOfLines
		};
	} catch (e) {
		if (typeof e === 'string') {
			throw error(500, e.toUpperCase());
		} else if (e instanceof Error) {
			throw error(500, e.message);
		}
	}

	throw error(404, 'Not found');
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const title = data.get('title') as string;
		const content = data.get('content') as string;
		const slug = nanoid(6);

		if (!title) {
			return invalid(400, { title, missing: true });
		}

		if (!content) {
			return invalid(400, { content, missing: true });
		}

		try {
			await prisma.gist.create({
				data: {
					title,
					content,
					slug
				}
			});
		} catch (e) {
			if (typeof e === 'string') {
				throw error(500, e.toUpperCase());
			} else if (e instanceof Error) {
				throw error(500, e.message);
			}
		}

		throw redirect(303, `/${slug}`);
	}
};
