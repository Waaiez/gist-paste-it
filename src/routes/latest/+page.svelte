<script lang="ts">
	import { Divider, toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { inview } from 'svelte-inview';
	import SkeletonCard from './SkeletonCard.svelte';
	import autoAnimate from '$lib/autoAnimate';
	import { formatTimeAgo } from './formatTime';
	import { onMount } from 'svelte';

	let loading = true;

	let pastes: LatestPastes[] = [];
	let nextId: string | undefined = undefined;
	let hasMoreData = nextId ? true : false;
	let currentPasteCount = pastes.length;
	let newPastes: LatestPastes[] = [];

	type LatestPastes = {
		createdAt: Date;
		slug: string;
		title: string;
		views: number;
		language: string;
	};

	async function fetchLatestPastes(
		cursor: string = ''
	): Promise<{ pastes: LatestPastes[]; nextId: string }> {
		const urlParams = new URLSearchParams({
			cursor
		});

		try {
			const response = await fetch(`/api/pastes/latest?${urlParams}`);

			if (response.ok) {
				const data = await response.json();

				return data;
			} else {
				throw new Error('Failed to fetch latest pastes');
			}
		} catch (error) {
			const toastMessage: ToastSettings = {
				message: 'Failed to fetch latest pastes, please try again later',
				classes: 'bg-warning-500'
			};
			toastStore.trigger(toastMessage);

			return {
				pastes: [],
				nextId: ''
			};
		}
	}

	onMount(async () => {
		const { pastes: initialPastes, nextId: initialNextId } = await fetchLatestPastes();

		pastes = [...pastes, ...initialPastes];
		nextId = initialNextId;

		hasMoreData = initialNextId ? true : false;
		currentPasteCount = pastes.length;
		loading = false;
	});

	const loadMore = async () => {
		if (loading || !hasMoreData || currentPasteCount >= 100) return;
		loading = true;

		setTimeout(async () => {
			const { pastes, nextId: newNextId } = await fetchLatestPastes(nextId);

			newPastes = [...pastes];

			nextId = newNextId;

			hasMoreData = nextId ? true : false;

			currentPasteCount += pastes.length;

			loading = false;
		}, Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000);
	};

	$: pastes = [...pastes, ...newPastes];
</script>

<div class="max-w-7xl mx-auto px-10 py-5 h-full flex flex-col">
	<div class="px-10 w-full flex flex-col justify-center mt-5 mb-10">
		<span class="text-4xl text-center p-1 line-clamp-1 md:line-clamp-3 lg:line-clamp-none"
			>Latest Pastes</span
		>
		<Divider />
	</div>
	{#if pastes.length === 0 && !loading}
		<div class="flex flex-col justify-center items-center w-full h-full">
			<span class="text-2xl text-center p-1 line-clamp-1 md:line-clamp-3 lg:line-clamp-none"
				>No pastes found</span
			>
		</div>
	{:else}
		<ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 grow pb-5" use:autoAnimate>
			{#each pastes as paste}
				<a
					href="/view/{paste.slug}"
					class="!text-inherit !no-underline"
					data-sveltekit-preload-data="off"
				>
					<div
						class="card flex flex-col justify-between shadow-md hover:bg-accent-100 dark:hover:bg-accent-500 transition ease-in-out duration-300 space-y-8"
					>
						<div>
							<header class="card-header line-clamp-1 text-center text-xl">
								{paste.title}
							</header>
							<Divider />
						</div>
						<div class="card-body text-center">
							Language: {paste.language} <br />
						</div>
						<footer class="card-footer flex justify-between text-sm">
							<span>
								Views: {paste.views}
							</span>

							<span>
								{formatTimeAgo(new Date(paste.createdAt))}
							</span>
						</footer>
					</div>
				</a>
			{/each}

			{#if loading}
				{#each Array(3) as _}
					<SkeletonCard />
				{/each}
			{/if}

			<div use:inview on:enter={loadMore} />
		</ul>
	{/if}
</div>
