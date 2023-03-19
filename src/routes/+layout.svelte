<script lang="ts">
	// theme names: skeleton rocket vintage modern sahara seafoam hamlindigo gold-nouveau crimson
	import '@skeletonlabs/skeleton/styles/all.css';
	import '@skeletonlabs/skeleton/themes/theme-vintage.css';
	import '../app.css';

	import {
		AppShell,
		drawerStore,
		Modal,
		ProgressRadial,
		storePopup,
		Toast
	} from '@skeletonlabs/skeleton';

	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';

	import { Menu } from '@steeze-ui/remix-icons';
	import { Icon } from '@steeze-ui/svelte-icon';

	import AppDraw from '$lib/components/AppDraw.svelte';

	import { navigating, page } from '$app/stores';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<svelte:head>
	<title>Pasterr</title>
	<meta name="description" content="Pasterr" />
</svelte:head>

<Modal buttonTextCancel="Close" />
<Toast position="tr" duration={500} />

<AppDraw />

<AppShell>
	{#if !$page.url.pathname.includes('raw')}
		<button
			type="button"
			class="btn-icon absolute top-3"
			on:click={() => {
				drawerStore.open();
			}}
		>
			<span> <Icon src={Menu} theme="solid" class="text-white" size="25" /> </span>
		</button>
	{/if}
	{#if $navigating}
		<!-- TODO: maybe implement skeleton loading animation -->
		<div class="flex h-full w-full flex-col items-center justify-center py-5">
			<div class="h-16 w-16">
				<ProgressRadial stroke={90} />
			</div>
		</div>
	{:else}
		<slot />
	{/if}
</AppShell>
