import prisma from '$lib/db';
import { Prisma } from '@prisma/client';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const { slug } = params;

	try {
		const gist = await prisma.gist.update({
			where: {
				slug
			},
			data: {
				views: {
					increment: 1
				}
			}
		});

		return json({
			gist
		});
	} catch (e) {
		console.log('Error retrieving gist, [api/gists/retrieve/[slug]]', e);

		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === 'P2025') {
				return new Response('Gist does not exist', {
					status: 404,
					statusText: 'Gist does not exist'
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
}
