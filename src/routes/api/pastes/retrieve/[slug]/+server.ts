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

		return json(
			{
				success: true,
				message: 'Paste fetched successfully',
				paste: pasteWithoutId
			},
			{
				status: 200
			}
		);
	} catch (e) {
		console.log('Error retrieving paste, [api/pastes/retrieve/[slug]]', e);

		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === 'P2025') {
				return json(
					{
						success: false,
						message: 'Paste does not exist',
						paste: null
					},
					{
						status: 404,
						statusText: 'Paste does not exist'
					}
				);
			}

			return json(
				{
					success: false,
					message: 'There was an error retrieving data',
					paste: null
				},
				{
					status: 500,
					statusText: 'There was an error retrieving data'
				}
			);
		}

		return json(
			{
				success: false,
				message: 'Internal server error',
				paste: null
			},
			{
				status: 500,
				statusText: 'Internal server error'
			}
		);
	}
};
