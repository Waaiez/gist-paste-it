<script lang="ts">
	import { page } from '$app/stores';
	import { uneval } from 'devalue';
	import type { PageData } from './$types';

	import {
		toastStore,
		clipboard,
		menu,
		type ToastSettings,
		type ModalSettings,
		modalStore
	} from '@skeletonlabs/skeleton';

	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowUpS } from '@steeze-ui/remix-icons';

	import hljs from 'highlight.js';
	import hljs_svelte from 'highlightjs-svelte';
	import 'highlight.js/styles/github-dark.css';

	hljs_svelte(hljs);

	export let data: PageData;

	// https://github.com/rich-harris/devalue#xss-mitigation
	const cleanedValue = uneval(data.paste.content);
	const cleanPasteContent = (0, eval)('(' + cleanedValue + ')');

	const viewCountString =
		data.paste.views === 1 ? `${data.paste.views} View` : `${data.paste.views} Views`;

	function handleCopy() {
		const toastMessage: ToastSettings = {
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

	const showTitleModal: ModalSettings = {
		type: 'alert',
		body: data.paste.title,
		classes: 'text-center text-2xl'
	};
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
	<!-- <div class="w-full flex justify-center px-10"><span class="text-4xl w-full flex justify-center text-center">{data.paste.title}</span></div> -->

	<!-- Paste Title -->
	<div class="px-10 w-full flex justify-center my-2">
		<span class="text-4xl text-center p-1 line-clamp-1 md:line-clamp-3 lg:line-clamp-none"
			>{data.paste.title}</span
		>
	</div>
	<!-- Paste Title -->

	<!-- Paste Content -->
	<div class="h-64 flex grow w-full md:px-10 flex-col">
		<div class="flex justify-between items-center py-2 px-3 border-b border-gray-500 w-full">
			<div class="flex flex-wrap items-center">
				<div class="flex items-center space-x-1 sm:pr-4">
					<span class="text-gray-500">{data.paste.language}</span>
				</div>
			</div>

			<div class="p-1 text-center text-gray-500 rounded sm:ml-auto">
				{viewCountString}
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
	<!-- Paste Content -->

	<!-- Action Buttons -->
	<div class="w-full h-14 flex justify-center px-10 my-2">
		<a href="/" class="btn text-white btn-filled-primary w-full max-w-xs mx-2 !text-xl"
			><span class="w-full">New</span></a
		>

		<div class="relative">
			<button
				type="button"
				class="btn-filled-accent btn text-white mx-2 h-full"
				use:menu={{ menu: 'paste-options' }}
			>
				<Icon src={ArrowUpS} theme="solid" class="text-white" size="30" />
			</button>
			<nav class="list-nav card p-4 w-64 shadow-xl" data-menu="paste-options">
				<ul data-sveltekit-prefetch="off">
					<li>
						<button
							type="button"
							class="btn text-white hover:bg-primary-500/10 w-full !text-left"
							on:click={() => modalStore.trigger(showTitleModal)}
							><span class="w-full">Show Title</span>
						</button>
					</li>
					<li>
						<button
							type="button"
							class="btn text-white hover:bg-primary-500/10 w-full !text-left"
							use:clipboard={data.paste.content}
							on:click={handleCopy}
							><span class="w-full">Copy</span>
						</button>
					</li>
					<li>
						<a
							href="/new/{$page.params.slug}"
							class="btn text-white hover:bg-primary-500/10 w-full !text-left"
							><span class="w-full px-1">Duplicate & Edit</span></a
						>
					</li>
					<li>
						<a
							href="/view/{$page.params.slug}/raw"
							class="btn text-white hover:bg-primary-500/10 w-full !text-left"
							><span class="w-full px-1">Raw</span></a
						>
					</li>
				</ul>
			</nav>
		</div>
	</div>
	<!-- Action Buttons -->
</div>
