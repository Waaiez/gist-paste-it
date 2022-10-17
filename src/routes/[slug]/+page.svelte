<script lang="ts">
	import { onMount } from 'svelte';

	import type { Gist } from '@prisma/client';
	import { goto } from '$app/navigation';

	/** @type {import('./$types').PageData} */ export let data: Gist;

	let lineLength = 1;

	onMount(() => {
		lineLength = data.content.split('\n').length;
	});

	function createNewGist() {
		goto('/');
	}
</script>

<div class="h-screen w-full flex flex-col py-5">
	<div class="w-full flex justify-center px-10">
		<span class="text-4xl w-full flex justify-center">{data.title}</span>
	</div>
	<div
		class="h-full w-full inline-flex leading-snug relative pt-5 pl-6 font-mono text-lg overflow-auto scrollbar-thin"
	>
		<div class="h-full top-5 left-0 w-8 text-right select-none float-left text-surface-400">
			{#each Array(lineLength) as _, i}
				<span class="block">{i + 1}</span>
			{/each}
		</div>
		<textarea
			id="content"
			name="content"
			class="!bg-transparent border-0 w-full h-full outline-none resize-none -my-2 focus:ring-0 text-lg !leading-snug"
			readonly
			value={data.content}
		/>
	</div>
	<div class="w-full h-14 flex justify-center px-10">
		<button
			type="button"
			class="w-full max-w-xs bg-primary-500 btn btn-sm text-white rounded-lg text-lg mx-2"
			on:click={createNewGist}
		>
			<span> New </span>
		</button>
	</div>
</div>
