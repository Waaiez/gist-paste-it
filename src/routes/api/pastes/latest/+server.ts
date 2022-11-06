import prisma from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const { cursor } = Object.fromEntries(url.searchParams);
	const cursorObj = cursor ? { id: cursor } : undefined;

	const limit = 18;

	try {
		// @ts-ignore
		const pastes = await prisma.paste.findMany({
			take: limit,
			skip: cursor ? 1 : 0,
			cursor: cursorObj,
			where: {
				isPrivate: false
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

		return json({ pastes: pastesWithoutId, nextId });
	} catch (e) {
		console.log('Error retrieving latest pastes, [api/pastes/retrieve/[slug]]', e);

		return new Response('There was an error retrieving data', {
			status: 500,
			statusText: 'There was an error retrieving data'
		});
	}
};
