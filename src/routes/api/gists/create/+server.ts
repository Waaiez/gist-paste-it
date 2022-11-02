import languages from '$lib/components/LanguageSelection/languages.json';
import prisma from '$lib/db';
import { z } from 'zod';

type LanguageName = typeof languages[number]['name'];
const LanguageNameValues: [LanguageName, ...LanguageName[]] = [
	languages[0]!.name,
	...languages.slice(1).map((p) => p.name)
];

const PasteSchema = z.object({
	title: z.string().min(1).max(255),
	content: z.string().min(1).max(25000),
	languageSelected: z.enum(LanguageNameValues),
	slug: z.string().min(6).max(6)
});

type PasteSchema = z.infer<typeof PasteSchema>;

async function verifyInput(inputData: PasteSchema) {
	const { title, content } = inputData;

	try {
		if (!title) throw new Error('Title is required');
		if (!content) throw new Error('Content is required');

		PasteSchema.parse(inputData);

		return {
			success: true,
			statusCode: 200,
			message: 'Success'
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			const flattenedErrors = error.flatten().fieldErrors;

			if (flattenedErrors.title)
				return {
					success: false,
					statusCode: 422,
					message: 'Title is invalid, please check the length and try again'
				};

			if (flattenedErrors.content)
				return {
					success: false,
					statusCode: 422,
					message: 'Content is invalid, please check the length and try again'
				};

			if (flattenedErrors.languageSelected)
				return {
					success: false,
					statusCode: 422,
					message: 'Language is invalid, please check your selection and try again'
				};

			return {
				success: false,
				statusCode: 500,
				message: 'Internal Server Error'
			};
		}

		if (error instanceof Error) {
			return {
				success: false,
				statusCode: 422,
				message: error.message
			};
		}
		return {
			success: false,
			statusCode: 500,
			message: 'Internal server error'
		};
	}
}

export async function POST({ request }) {
	const pasteData: PasteSchema = await request.json();
	const { title, content, languageSelected, slug } = pasteData;

	const languageShortHand = languages.find(function (el) {
		return el.name === languageSelected;
	});

	const testResults = await verifyInput(pasteData);

	if (!testResults.success) {
		return new Response(testResults.message, {
			status: testResults.statusCode,
			statusText: testResults.message
		});
	}

	try {
		await prisma.gist.create({
			data: {
				title,
				content,
				slug,
				language: languageSelected,
				languageShortHand: languageShortHand?.value ?? 'plaintext'
			}
		});

		return new Response('Successfully created gist', {
			status: 201,
			statusText: 'Successfully created gist'
		});
	} catch (e) {
		console.log('Error creating gist, [api/gists/create]]', e);

		return new Response('Something went wrong', {
			status: 500,
			statusText: 'Something went wrong'
		});
	}
}
