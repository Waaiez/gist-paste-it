import { json } from '@sveltejs/kit';
import { customAlphabet } from 'nanoid';

import languages from '$lib/components/NewPasteForm/LanguageSelection/languages.json';
import prisma from '$lib/db';

import type { RequestHandler } from './$types';
import type { PasteSchema } from './types';

import { verifyInput } from './verifyInput';

export const POST: RequestHandler = async ({ request }) => {
	const pasteData: PasteSchema = await request.json();

	const { title, content, languageSelection, visibility } = pasteData;

	const nanoid = customAlphabet(
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
		7
	);

	const slug = nanoid();

	const languageShortHand = languages.find(function (el) {
		return el.name === languageSelection;
	});

	const testResults = await verifyInput(pasteData);
	if (!testResults.success)
		return json(
			{
				success: false,
				message: testResults.message,
				slug: '',
				redirect: ''
			},
			{
				status: testResults.statusCode
			}
		);

	try {
		await prisma.paste.create({
			data: {
				title,
				content,
				slug,
				language: languageSelection,
				languageShortHand: languageShortHand?.value ?? 'plaintext',
				visibility
			}
		});

		return json(
			{
				success: true,
				message: 'Paste created successfully',
				slug,
				redirect: `/view/${slug}`
			},
			{
				status: 201
			}
		);
	} catch (error) {
		console.log('Error creating paste, [api/pastes/create]]', error);

		return json(
			{
				success: false,
				message: 'There was an error creating your paste, please try again later',
				slug: '',
				redirect: ''
			},
			{
				status: 500
			}
		);
	}
};
