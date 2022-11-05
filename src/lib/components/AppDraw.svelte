<script lang="ts">
	import { storeDrawer } from '$lib/stores';
	import { Drawer, Divider } from '@brainandbones/skeleton';

	import { page } from '$app/stores';

	function onListItemClick(): void {
		storeDrawer.set(false);
	}

	$: classesActive = (href: string) => ($page.url.pathname === href ? '!bg-primary-500' : '');

	console.log($page.url);

	let menuNavLinks: any = [
		{ href: '/latest', label: 'Latest Pastes' },
		{ href: '/', label: 'New Paste' },
		{ href: '/new/file', label: 'File Upload' }
	];
</script>

<Drawer open={storeDrawer} position="left" width="w-64">
	<div class="h-full border-r border-black/5 dark:border-white/5 {$$props.class ?? ''}">
		<section class="p-4 overflow-y-auto w-full h-full flex flex-col">
			<span class="text-center justify-center flex text-3xl font-bold">Pasterr</span>
			<Divider />

			<nav class="list-nav h-full items-center flex">
				<ul class="w-full">
					{#each menuNavLinks as { href, label }}
						<li on:click={onListItemClick} on:keypress>
							<a {href} value={href} class={classesActive(href)} data-sveltekit-prefetch>
								<span class="flex-auto text-xl">{label}</span>
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</section>
	</div>
</Drawer>
