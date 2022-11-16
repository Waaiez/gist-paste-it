<script>
	import '@brainandbones/skeleton/themes/theme-skeleton.css';
	import '@brainandbones/skeleton/styles/all.css';
	import '../app.css';
	import { Modal, Toast } from '@brainandbones/skeleton';

	import { Icon } from '@steeze-ui/svelte-icon';
	import { Bars3 } from '@steeze-ui/heroicons';

	import { storeDrawer } from '$lib/stores';
	import AppDraw from '$lib/components/AppDraw.svelte';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Pasterr</title>
	<meta name="description" content="Pasterr" />
</svelte:head>

<Modal />
<Toast position="tr" duration={500} />

<AppDraw />

<main class="h-screen scrollbar-thin relative">
	{#if !$page.url.pathname.includes('raw')}
		<button
			type="button"
			class="btn-icon absolute top-3"
			on:click={() => {
				storeDrawer.set(true);
			}}
		>
			<span><Icon src={Bars3} theme="solid" class="text-white" size="30" /> </span>
		</button>
	{/if}

	<slot />
</main>
