export async function post<T extends { [key: string]: unknown }>(endpoint: string, data: T) {
	const r = await fetch(endpoint, {
		method: 'POST',
		body: JSON.stringify(data || {}),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return await r.json();
}
