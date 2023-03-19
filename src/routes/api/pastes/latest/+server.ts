import prisma from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const { cursor: cursorId } = Object.fromEntries(url.searchParams);
	const cursor = cursorId ? { id: cursorId } : undefined;

	const limit = 18;

	try {
		// @ts-ignore
		//* typescript doesn't like that cursor can be undefined
		const pastes = await prisma.paste.findMany({
			take: limit,
			skip: cursorId ? 1 : 0,
			cursor,
			where: {
				visibility: 'public'
			},
			select: {
				id: true,
				title: true,
				language: true,
				slug: true,
				createdAt: true,
				views: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		const nextId = pastes.length === limit ? pastes[limit - 1]!.id : undefined;

		const pastesWithoutId = pastes.map(({ id, ...keepAttrs }) => keepAttrs);

		return json(
			{
				success: true,
				message: 'Latest pastes fetched successfully',
				pastes: pastesWithoutId,
				nextId
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log('Error retrieving latest pastes, [api/pastes/retrieve/[slug]]', error);

		return json(
			{
				success: false,
				message: 'There was an error fetching latest pastes',
				pastes: [],
				nextId: undefined
			},
			{ status: 500 }
		);
	}
};
