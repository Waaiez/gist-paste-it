import { z } from 'zod';
import languages from '$lib/components/LanguageSelection/languages.json';

export type LanguageName = typeof languages[number]['name'];

const LanguageNameValues: [LanguageName, ...LanguageName[]] = [
	languages[0]!.name,
	...languages.slice(1).map((p) => p.name)
];

export const PasteSchema = z.object({
	title: z
		.string({
			required_error: 'Title is required',
			invalid_type_error: 'Title must be a string'
		})
		.min(1, { message: 'Title must be at least 1 character long' })
		.max(255, { message: 'Title must be at most 255 characters long' }),
	content: z
		.string({
			required_error: 'Content is required',
			invalid_type_error: 'Content must be a string'
		})
		.min(1, { message: 'Content must be at least 1 character long' })
		.max(25000, { message: 'Content must be at most 25000 characters long' }),
	languageSelection: z.enum(LanguageNameValues),
	visibility: z.enum(['public', 'private'])
});

export type PasteSchema = z.infer<typeof PasteSchema>;
