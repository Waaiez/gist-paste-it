<script>
	import '@brainandbones/skeleton/themes/theme-skeleton.css';
	import '@brainandbones/skeleton/styles/all.css';
	import '../app.css';
	import { Dialog, Toast } from '@brainandbones/skeleton';

	import Icon from 'svelte-icons-pack';
	import FiMenu from 'svelte-icons-pack/fi/FiMenu';

	import { storeDrawer } from '$lib/stores';
	import AppDraw from '$lib/components/AppDraw.svelte';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Pasterr</title>
	<meta name="description" content="Pasterr" />
</svelte:head>

<Dialog backdrop="bg-primary-500/50" blur="backdrop-blur-sm" card="bg-primary-500" duration={250} />
<Toast background="bg-accent-500" position="tr" duration={500} />

<AppDraw />

<main class="h-screen scrollbar-thin relative">
	{#if !$page.url.pathname.includes('raw')}
		<button
			class="btn-icon absolute top-3"
			on:click={() => {
				storeDrawer.set(true);
			}}
		>
			<span><Icon src={FiMenu} color="white" size="25" /></span>
		</button>
	{/if}

	<slot />
</main>
