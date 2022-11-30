<script lang="ts">
	import type { PageData } from './$types';
	import { Divider } from '@skeletonlabs/skeleton';
	import { inview } from 'svelte-inview';
	import SkeletonCard from './SkeletonCard.svelte';
	import type { LatestPastes } from './Types';
	import autoAnimate from '$lib/autoAnimate';

	export let data: PageData;
	let { pastes, nextId } = data;

	let loading = false;
	let hasMoreData = nextId ? true : false;

	let newPastes: LatestPastes[] = [];

	let currentPasteCount = pastes.length;

	const loadMore = async () => {
		if (loading || !hasMoreData || currentPasteCount >= 100) return;
		loading = true;

		setTimeout(async () => {
			// @ts-ignore
			const urlParams = new URLSearchParams({
				cursor: nextId
			});

			const res = await fetch(`/api/pastes/latest?${urlParams}`);
			const { pastes, nextId: newNextId }: { pastes: LatestPastes[]; nextId: string } =
				await res.json();

			newPastes = [...pastes];

			nextId = newNextId;
			hasMoreData = nextId ? true : false;
			currentPasteCount += pastes.length;
			loading = false;
		}, 2500);
	};

	$: pastes = [...pastes, ...newPastes];

	const formatter = new Intl.RelativeTimeFormat(undefined, {
		numeric: 'auto'
	});

	const DIVISIONS = [
		{ amount: 60, name: 'seconds' },
		{ amount: 60, name: 'minutes' },
		{ amount: 24, name: 'hours' },
		{ amount: 7, name: 'days' },
		{ amount: 4.34524, name: 'weeks' },
		{ amount: 12, name: 'months' },
		{ amount: Number.POSITIVE_INFINITY, name: 'years' }
	];

	// https://blog.webdevsimplified.com/2020-07/relative-time-format/
	// @ts-ignore
	function formatTimeAgo(date: any) {
		const newDate = new Date() as any;
		let duration = (date - newDate) / 1000;

		for (let i = 0; i <= DIVISIONS.length; i++) {
			const division = DIVISIONS[i];
			if (Math.abs(duration) < division!.amount) {
				return formatter.format(
					Math.round(duration),
					division!.name as Intl.RelativeTimeFormatUnit
				);
			}
			duration /= division!.amount;
		}
	}
</script>

<div class="max-w-7xl mx-auto px-10 py-5 h-full flex flex-col">
	<div class="px-10 w-full flex flex-col justify-center mt-5 mb-10">
		<span class="text-4xl text-center p-1 line-clamp-1 md:line-clamp-3 lg:line-clamp-none"
			>Latest Pastes</span
		>
		<Divider />
	</div>

	<ul
		class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 grow pb-5"
		data-sveltekit-prefetch="off"
		use:autoAnimate
	>
		{#each pastes as paste}
			<a href="/view/{paste.slug}" class="!text-inherit !no-underline">
				<div
					class="card flex flex-col justify-between shadow-md hover:bg-accent-100 dark:hover:bg-accent-500 transition ease-in-out duration-300"
				>
					<header class="card-header line-clamp-1 text-center text-xl">
						{paste.title}
					</header>
					<Divider />
					<div class="card-body">
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
</div>
