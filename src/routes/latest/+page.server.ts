import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { LatestPastes } from './Types';

export const load: PageServerLoad = async ({ fetch }) => {
	const urlParams = new URLSearchParams({});

	const response = await fetch(`/api/pastes/latest?${urlParams}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		throw error(response.status, response.statusText);
	}

	const { pastes, nextId }: { pastes: LatestPastes[]; nextId: string | undefined } =
		await response.json();

	return {
		pastes,
		nextId
	};
};
