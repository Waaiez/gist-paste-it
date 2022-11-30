<script>
	// skeleton rocket vintage modern sahara seafoam hamlindigo gold-nouveau crimson
	import '@skeletonlabs/skeleton/themes/theme-vintage.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.css';

	import { Modal, Toast } from '@skeletonlabs/skeleton';

	import { Icon } from '@steeze-ui/svelte-icon';
	import { Menu } from '@steeze-ui/remix-icons';

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
			<span> <Icon src={Menu} theme="solid" class="text-white" size="25" /> </span>
		</button>
	{/if}

	<slot />
</main>
