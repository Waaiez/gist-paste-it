import { z } from 'zod';
import { PasteSchema } from './types';

async function createErrorMessage(
	statusCode: number,
	errorType: 'input' | 'selection' | 'generic' = 'generic',
	errorCause: string = ''
) {
	let message = 'Internal Server Error';

	if (errorType === 'input') {
		message = `${errorCause} is invalid, please check the length and try again`;
	} else if (errorType === 'selection') {
		message = `${errorCause} is invalid, please check your selection and try again`;
	}

	return {
		success: false,
		statusCode,
		message
	};
}

export const verifyInput = async (inputData: PasteSchema) => {
	try {
		PasteSchema.parse(inputData);

		return {
			success: true,
			statusCode: 200,
			message: 'Success'
		};
	} catch (error) {
		console.error('Error verifying input, [api/pastes/create]', error);

		if (error instanceof z.ZodError) {
			const flattenedErrors = error.flatten().fieldErrors;

			if (flattenedErrors.title) return await createErrorMessage(422, 'input', 'Title');

			if (flattenedErrors.content) return await createErrorMessage(422, 'input', 'Content');

			if (flattenedErrors.languageSelection)
				return await createErrorMessage(422, 'selection', 'Language Selection');

			if (flattenedErrors.visibility)
				return await createErrorMessage(422, 'selection', 'Visibility');

			return await createErrorMessage(500);
		}

		return await createErrorMessage(500);
	}
};
