import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { customAlphabet } from 'nanoid';

const prisma = new PrismaClient();

type SeedPaste = {
	title: string;
	content: string;
	slug: string;
	isPrivate: boolean;
};

async function main() {
	await prisma.paste.deleteMany({}); // use with caution.

	const amountOfPastes = 100;

	const pastes: SeedPaste[] = [];

	const nanoid = customAlphabet(
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
		7
	);

	for (let i = 0; i < amountOfPastes; i++) {
		// generate a number between 1 and 20
		const randomNum = Math.floor(Math.random() * 20) + 1;

		const title = faker.lorem.words(randomNum);
		const content = faker.lorem.paragraphs(randomNum);
		const slug = nanoid();
		const isPrivate = Math.random() >= 0.85;

		const paste: SeedPaste = {
			title,
			content,
			slug,
			isPrivate
		};

		pastes.push(paste);
	}

	const addPastes = async () => await prisma.paste.createMany({ data: pastes });

	addPastes();
}

main()
	.catch((e) => {
		console.error(e);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
