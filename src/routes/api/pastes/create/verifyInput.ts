import { z } from 'zod';
import { PasteSchema } from './Types';

async function createErrorMessage(
	statusCode: number,
	errorType: 'input' | 'selection' | 'unknown' | 'generic',
	errorCause: string
) {
	let message = 'Internal Server Error';

	if (errorType === 'input') {
		message = `${errorCause} is invalid, please check the length and try again`;
	} else if (errorType === 'selection') {
		message = `${errorCause} is invalid, please check your selection and try again`;
	} else if (errorType === 'unknown') {
		message = errorCause;
	}

	return {
		success: false,
		statusCode,
		message
	};
}

export const verifyInput = async (inputData: PasteSchema) => {
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

			if (flattenedErrors.title) return await createErrorMessage(422, 'input', 'Title');

			if (flattenedErrors.content) return await createErrorMessage(422, 'input', 'Content');

			if (flattenedErrors.languageSelection)
				return await createErrorMessage(422, 'selection', 'Language Selection');

			if (flattenedErrors.visibility)
				return await createErrorMessage(422, 'selection', 'Visibility');

			return await createErrorMessage(500, 'generic', '');
		}

		//! TODO: Probably not the best idea to return an error message like this as I don't know whether it contains sensitive information or not
		if (error instanceof Error) return await createErrorMessage(422, 'unknown', error.message);

		return await createErrorMessage(500, 'generic', '');
	}
};
