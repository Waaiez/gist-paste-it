<script lang="ts">
	import autoAnimate from '$lib/autoAnimate';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { inview } from 'svelte-inview';
	import { formatTimeAgo } from './formatTime';
	import SkeletonCard from './SkeletonCard.svelte';

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

<div class="mx-auto flex h-full max-w-7xl flex-col px-10 py-5">
	<div class="mt-5 mb-10 flex w-full flex-col justify-center px-10">
		<span class="p-1 text-center text-4xl line-clamp-1 md:line-clamp-3 lg:line-clamp-none"
			>Latest Pastes</span
		>
	</div>
	{#if pastes.length === 0 && !loading}
		<div class="flex h-full w-full flex-col items-center justify-center">
			<span class="p-1 text-center text-2xl line-clamp-1 md:line-clamp-3 lg:line-clamp-none"
				>No pastes found</span
			>
		</div>
	{:else}
		<ul class="grid grow grid-cols-1 gap-6 pb-5 sm:grid-cols-2 lg:grid-cols-3" use:autoAnimate>
			{#each pastes as paste}
				<a
					href="/view/{paste.slug}"
					class="!text-inherit !no-underline"
					data-sveltekit-preload-data="off"
				>
					<div
						class="hover:bg-accent-100 dark:hover:bg-accent-500 card flex flex-col justify-between space-y-8 shadow-md transition duration-300 ease-in-out"
					>
						<div>
							<header class="card-header text-center text-xl line-clamp-1">
								{paste.title}
							</header>
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

			<div use:inview on:inview_enter={loadMore} />
		</ul>
	{/if}
</div>
