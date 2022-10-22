<script lang="ts">
	import { goto } from '$app/navigation';

	import { uneval } from 'devalue';
	import { menu, type ToastMessage } from '@brainandbones/skeleton';
	import { page } from '$app/stores';
	import { toastStore, clipboard } from '@brainandbones/skeleton';
	import Icon from 'svelte-icons-pack';
	// @ts-ignore
	import FaSolidChevronUp from 'svelte-icons-pack/fa/FaSolidChevronUp';
	import type { PageData } from './$types';

	export let data: PageData;

	// https://github.com/rich-harris/devalue#xss-mitigation
	const cleanedValue = uneval(data.gist.content);
	const cleanGistContent = (0, eval)('(' + cleanedValue + ')');

	function handleCopy() {
		const toastMessage: ToastMessage = {
			message: 'Copied to clipboard'
		};
		toastStore.trigger(toastMessage);
	}
</script>

<div class="h-screen w-full flex flex-col py-5">
	<div class="w-full flex justify-center px-10">
		<span class="text-4xl w-full flex justify-center">{data.gist.title}</span>
	</div>

	<div class="h-full relative  md:pl-12 font-mono overflow-auto my-3">
		<div class="h-full top-5 left-0 w-8 text-right select-none float-left text-surface-400">
			{#each Array(data.numOfLines) as _, i}
				<span class="block">{i + 1}</span>
			{/each}
		</div>
		<div class="container relative h-full">
			<pre
				class="!bg-transparent border-0 outline-none resize-none focus:ring-0 text-lg !leading-normal -my-10 !py-0 !px-4 overflow-hidden min-h-full overflow-x-auto"
				data-clipboard="gist-content">{cleanGistContent}</pre>
		</div>
	</div>

	<div class="w-full h-14 flex justify-center px-10">
		<button
			type="button"
			class="w-full max-w-xs bg-primary-500 btn btn-sm text-white rounded-lg text-lg mx-2"
			on:click={() => goto('/')}
		>
			<span> New </span>
		</button>
		<div class="relative">
			<button
				type="button"
				class="bg-accent-500 btn btn-sm text-white rounded-lg text-lg mx-2 h-full"
				use:menu={{ menu: 'gist-options' }}
			>
				<Icon src={FaSolidChevronUp} color="white" size="20" />
			</button>
			<nav class="list-nav card p-4 w-64 shadow-xl" data-menu="gist-options">
				<ul>
					<li>
						<button
							type="button"
							class="btn btn-base text-white hover:bg-primary-500/10 rounded-lg w-full !text-left"
							use:clipboard={data.gist.content}
							on:click={handleCopy}
							><span class="w-full">Copy</span>
						</button>
					</li>
					<li>
						<button
							type="button"
							class="btn btn-base text-white hover:bg-primary-500/10 rounded-lg w-full !text-left"
							on:click={() => goto('/new/' + $page.params.slug)}
							><span class="w-full">Duplicate & Edit</span>
						</button>
					</li>
					<li>
						<button
							type="button"
							class="btn btn-base text-white hover:bg-primary-500/10 rounded-lg w-full !text-left"
							on:click={() => goto('/' + $page.params.slug + '/raw')}
							><span class="w-full">Raw</span>
						</button>
					</li>
				</ul>
			</nav>
		</div>
	</div>
</div>
