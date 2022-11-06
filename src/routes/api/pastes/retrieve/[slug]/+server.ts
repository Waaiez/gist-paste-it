import prisma from '$lib/db';
import { Prisma } from '@prisma/client';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params;

	try {
		const paste = await prisma.paste.update({
			where: {
				slug
			},
			data: {
				views: {
					increment: 1
				}
			}
		});

		const pasteWithoutId = { ...paste, id: '' };

		return json({
			paste: pasteWithoutId
		});
	} catch (e) {
		console.log('Error retrieving paste, [api/pastes/retrieve/[slug]]', e);

		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === 'P2025') {
				return new Response('Paste does not exist', {
					status: 404,
					statusText: 'Paste does not exist'
				});
			}

			return new Response('There was an error retrieving data', {
				status: 500,
				statusText: 'There was an error retrieving data'
			});
		}

		return new Response('There was an error retrieving data', {
			status: 500,
			statusText: 'Internal server error'
		});
	}
};
