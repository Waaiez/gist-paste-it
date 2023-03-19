<script lang="ts">
	import { Drawer, drawerStore } from '@skeletonlabs/skeleton';

	import { page } from '$app/stores';

	import { Github } from '@steeze-ui/remix-icons';
	import { Icon } from '@steeze-ui/svelte-icon';

	function onListItemClick(): void {
		drawerStore.close();
	}

	$: classesActive = (href: string) => ($page.url.pathname === href ? '!bg-primary-500' : '');

	let menuNavLinks = [
		{ href: '/latest', label: 'Latest Pastes' },
		{ href: '/', label: 'New Paste' },
		{ href: '/new/file', label: 'File Upload' }
	];
</script>

<Drawer position="left" width="w-64">
	<div class="h-full border-r border-black/5 dark:border-white/5 {$$props.class ?? ''}">
		<section class="flex h-full w-full flex-col overflow-y-auto p-4">
			<span class="flex select-none justify-center text-center text-3xl font-bold">Pasterr</span>

			<nav class="list-nav flex h-full items-center">
				<ul class="w-full">
					{#each menuNavLinks as { href, label }}
						<li on:click={onListItemClick} on:keypress>
							<a {href} class={classesActive(href)} data-sveltekit-preload-data>
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
						class="btn w-full hover:variant-soft-primary"
					>
						<Icon src={Github} theme="solid" class="text-white" size="25" />
					</a>
				</li>
			</ul>
		</section>
	</div>
</Drawer>
