<script lang="ts">
	// import { storeDrawer } from '$lib/stores';
	import { Drawer, drawerStore, Divider, type DrawerSettings } from '@skeletonlabs/skeleton';

	import { page } from '$app/stores';

	import { Icon } from '@steeze-ui/svelte-icon';
	import { Github } from '@steeze-ui/remix-icons';

	function onListItemClick(): void {
		// storeDrawer.set(false);
		drawerStore.close();
	}

	$: classesActive = (href: string) => ($page.url.pathname === href ? '!bg-primary-500' : '');

	let menuNavLinks: any = [
		{ href: '/latest', label: 'Latest Pastes' },
		{ href: '/', label: 'New Paste' },
		{ href: '/new/file', label: 'File Upload' }
	];
</script>

<Drawer position="left" width="w-64">
	<div class="h-full border-r border-black/5 dark:border-white/5 {$$props.class ?? ''}">
		<section class="p-4 overflow-y-auto w-full h-full flex flex-col">
			<span class="text-center justify-center flex text-3xl font-bold">Pasterr</span>
			<Divider />

			<nav class="list-nav h-full items-center flex">
				<ul class="w-full">
					{#each menuNavLinks as { href, label }}
						<li on:click={onListItemClick} on:keypress>
							<a {href} value={href} class={classesActive(href)} data-sveltekit-preload-data>
								<span class="flex-auto text-xl">{label}</span>
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<ul>
				<li>
					<a
						href="https://github.com/Waaiez/pasterr"
						target="_blank"
						rel="noreferrer"
						class="btn hover:btn-filled-primary w-full"
					>
						<Icon src={Github} theme="solid" class="text-white" size="25" />
					</a>
				</li>
			</ul>
		</section>
	</div>
</Drawer>
