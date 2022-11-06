import prisma from '$lib/db';
import { ImageResponse } from '@ethercorps/sveltekit-og';
import type { Paste } from '@prisma/client';
import type { RequestHandler } from './$types';

const fontFile = await fetch('https://og-playground.vercel.app/inter-latin-ext-400-normal.woff');
const fontData: ArrayBuffer = await fontFile.arrayBuffer();

function createErrorTemplate(slug: string) {
	return `<div tw="bg-gray-50 flex w-full h-full items-center justify-center">
    <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
      <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-center w-full">
       <span tw="text-indigo-600 flex justify-center w-full">Pasterr</span>
        <span>ID: ${slug}</span>
        <span>Language: N/A</span>

      </h2>
      <div tw="mt-8 flex md:mt-0 w-full">
        <div tw="flex rounded-md w-full justify-center">
          <a href="#" tw="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white">View Now</a>
        </div>
      </div>
    </div>
  </div>`;
}

function createOgTemplate(paste: Paste) {
	return `<div tw="bg-gray-50 flex w-full h-full items-center justify-center">
    <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
      <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left w-full">
       <span tw="text-indigo-600 flex justify-center w-full">Pasterr</span>
        <span>ID: ${paste.slug}</span>
        <span>Language: ${paste.language}</span>
      </h2>
      <div tw="mt-8 flex md:mt-0 w-full">
        <div tw="flex rounded-md w-full justify-center">
          <a href="#" tw="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white">View Now</a>
        </div>
      </div>
    </div>
  </div>`;
}

// @ts-ignore
export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params;
	try {
		const paste = await prisma.paste.findUnique({
			where: {
				slug
			}
		});

		if (!paste) {
			const errorTemplate = createErrorTemplate(slug);
			return new ImageResponse(errorTemplate, {
				height: 250,
				width: 500,
				fonts: [
					{
						name: 'Inter Latin',
						data: fontData,
						weight: 400
					}
				]
			});
		}

		const ogTemplate = createOgTemplate(paste);
		return new ImageResponse(ogTemplate, {
			height: 250,
			width: 500,
			fonts: [
				{
					name: 'Inter Latin',
					data: fontData,
					weight: 400
				}
			]
		});
	} catch (e) {
		console.log('Error generating OG Image, [api/pastes/og/[slug]]', e);

		const errorTemplate = createErrorTemplate(slug);
		return new ImageResponse(errorTemplate, {
			height: 250,
			width: 500,
			fonts: [
				{
					name: 'Inter Latin',
					data: fontData,
					weight: 400
				}
			]
		});
	}
};
