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

	import hljs from 'highlight.js';
	import hljs_svelte from 'highlightjs-svelte';
	import 'highlight.js/styles/github-dark.css';
	import { urlAlphabet } from 'nanoid';

	hljs_svelte(hljs);

	export let data: PageData;

	// https://github.com/rich-harris/devalue#xss-mitigation
	const cleanedValue = uneval(data.paste.content);
	const cleanPasteContent = (0, eval)('(' + cleanedValue + ')');

	function handleCopy() {
		const toastMessage: ToastMessage = {
			message: 'Copied to clipboard'
		};
		toastStore.trigger(toastMessage);
	}

	let formatted: boolean = false;
	let displayCode: string = cleanPasteContent;

	const language = data.paste.languageShortHand;

	$: if (hljs !== undefined) {
		displayCode = hljs
			.highlight(cleanPasteContent, {
				language
			})
			.value.trim();
		formatted = true;
	}
</script>

<svelte:head>
	<meta property="og:title" content="Pasterr" />
	<meta property="og:site_name" content="Pasterr" />
	<meta property="og:description" content="A Paste From Pasterr" />
	<meta property="og:image" content="{$page.url.origin}/api/pastes/og/{data.paste.slug}" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<!-- TODO: look into whether these classes are needed -->
	<!-- TODO: Potentially line clamp for longer titles -->
	<!-- <div class="w-full flex justify-center px-10">

<span class="text-4xl w-full flex justify-center text-center">{data.paste.title}</span>
    </div> -->
	<div class="px-10 w-full flex justify-center my-2">
		<span class="text-4xl text-center">{data.paste.title}</span>
	</div>

	<div class="h-64 flex grow w-full md:px-10 flex-col">
		<div class="flex justify-between items-center py-2 px-3 border-b border-gray-500 w-full">
			<div class="flex flex-wrap items-center">
				<div class="flex items-center space-x-1 sm:pr-4">
					<span class="text-gray-500">{data.paste.language}</span>
				</div>
			</div>

			<div class="p-1 text-center text-gray-500 rounded sm:ml-auto">
				{data.paste.views === 1 ? `${data.paste.views} View` : `${data.paste.views} Views`}
			</div>
		</div>

		<div class="flex flex-grow items-center py-2 px-3 rounded-lg font-mono h-full overflow-scroll">
			<div class="h-full top-5 left-0 w-8 text-right select-none float-left text-gray-500">
				{#each Array(data.numberOfLines) as _, i}
					<span class="block">{i + 1}</span>
				{/each}
			</div>

			<div class="h-full w-full relative">
				<div class="code-block !bg-transparent text-white !leading-normal">
					<pre
						class="!bg-transparent text-white !leading-normal !rounded-none whitespace-pre break-all !py-0 !px-4 w-full resize-none"><code
							class="language-{language}"
							>{#if formatted}{@html displayCode}{:else}{cleanPasteContent.trim()}{/if}</code
						></pre>
				</div>
			</div>
		</div>
	</div>

	<div class="w-full h-14 flex justify-center px-10 my-2">
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
				use:menu={{ menu: 'paste-options' }}
			>
				<Icon src={FaSolidChevronUp} color="white" size="20" />
			</button>
			<nav class="list-nav card p-4 w-64 shadow-xl" data-menu="paste-options">
				<ul>
					<li>
						<button
							type="button"
							class="btn btn-base text-white hover:bg-primary-500/10 rounded-lg w-full !text-left"
							use:clipboard={data.paste.content}
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
