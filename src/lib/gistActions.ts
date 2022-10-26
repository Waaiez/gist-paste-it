import type { Gist } from '@prisma/client';
import * as z from 'zod';
import prisma from './db';

const GistSchema = z.object({
	title: z.string().min(1).max(255),
	content: z.string().min(1).max(25000)
});

const VerificationResultsSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	statusCode: z.number(),
	data: z.object({
		title: z.string(),
		content: z.string()
	})
});

async function verifyGistInput(
	title: string,
	content: string
): Promise<z.infer<typeof VerificationResultsSchema>> {
	if (!title) {
		return {
			success: false,
			message: 'Title is missing',
			statusCode: 400,
			data: {
				title: '',
				content: content ?? ''
			}
		};
	}

	if (!content) {
		return {
			success: false,
			message: 'Content is missing',
			statusCode: 400,
			data: {
				title: title ?? '',
				content: ''
			}
		};
	}

	const parsedData = GistSchema.safeParse({ title, content });

	if (!parsedData.success) {
		const flattenedErrors = parsedData.error.flatten().fieldErrors;

		if (flattenedErrors.title) {
			return {
				success: false,
				message: 'Title is invalid, please check the length and try again',
				statusCode: 400,
				data: {
					title: title ?? '',
					content: content ?? ''
				}
			};
		} else if (flattenedErrors.content) {
			return {
				success: false,
				message: 'Content is invalid, please check the length and try again',
				statusCode: 400,
				data: {
					title: title ?? '',
					content: content ?? ''
				}
			};
		} else {
			return {
				success: false,
				message: 'Something went wrong',
				statusCode: 400,
				data: {
					title: title ?? '',
					content: content ?? ''
				}
			};
		}
	}

	return {
		success: true,
		message: 'Success',
		statusCode: 200,
		data: {
			title: parsedData.data.title,
			content: parsedData.data.content
		}
	};
}

export async function createGist(
	title: string,
	content: string,
	slug: string
): Promise<z.infer<typeof VerificationResultsSchema>> {
	const results = await verifyGistInput(title, content);

	if (!results.success) return results;

	try {
		const gist = await prisma.gist.create({
			data: {
				title: results.data.title,
				content: results.data.content,
				slug
			}
		});

		return {
			success: true,
			message: 'Successfully created gist',
			statusCode: 201,
			data: {
				title,
				content
			}
		};
	} catch (e) {
		console.log('Error creating gist, [gistActions.ts > createGist()]', e);

		return {
			success: false,
			message: 'Something went wrong',
			statusCode: 500,
			data: {
				title: '',
				content: ''
			}
		};
	}
}

export async function retrieveGist(slug: string) {
	try {
		const gist = await prisma.gist.findUnique({
			where: {
				slug
			}
		});

		if (!gist) {
			return {
				success: false,
				message: 'Gist not found',
				statusCode: 404,
				data: {}
			};
		}

		const numOfLines = gist.content.split('\n').length;

		return {
			success: true,
			message: 'Success',
			statusCode: 200,
			data: {
				gist,
				numOfLines
			}
		};
	} catch (e) {
		console.log('Error retrieving gist, [gistActions.ts > retrieveGist()]', e);

		return {
			success: false,
			message: 'Something went wrong',
			statusCode: 500,
			data: {}
		};
	}
}
