<script lang="ts">
	import { page } from '$app/stores';
	import { uneval } from 'devalue';
	import type { PageData } from './$types';

	import {
		clipboard,
		modalStore,
		popup,
		toastStore,
		type ModalSettings,
		type PopupSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';

	import { ArrowUpS } from '@steeze-ui/remix-icons';
	import { Icon } from '@steeze-ui/svelte-icon';

	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css';
	import hljs_svelte from 'highlightjs-svelte';

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
		title: 'Paste Title',
		body: data.paste.title,
		modalClasses: 'text-center text-2xl',
		buttonTextCancel: 'Close'
	};

	let pasteOptionsSettings: PopupSettings = {
		event: 'click',
		target: 'pasteOptions'
	};
</script>

<svelte:head>
	<meta property="og:title" content="Pasterr" />
	<meta property="og:site_name" content="Pasterr" />
	<meta property="og:description" content="A Paste From Pasterr" />
	<meta property="og:image" content="{$page.url.origin}/api/pastes/og/{data.paste.slug}" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<!-- Paste Title -->
	<div class="my-2 flex w-full justify-center px-10">
		<span class="p-1 text-center text-4xl line-clamp-1 md:line-clamp-3 lg:line-clamp-none"
			>{data.paste.title}</span
		>
	</div>
	<!-- Paste Title -->

	<!-- Paste Content -->
	<div class="flex h-64 w-full grow flex-col md:px-10">
		<div class="flex w-full items-center justify-between border-b border-gray-500 py-2 px-3">
			<div class="flex flex-wrap items-center">
				<div class="flex items-center space-x-1 sm:pr-4">
					<span class="text-gray-500">{data.paste.language}</span>
				</div>
			</div>

			<div class="rounded p-1 text-center text-gray-500 sm:ml-auto">
				{viewCountString}
			</div>
		</div>

		<div class="flex h-full flex-grow items-center overflow-scroll rounded-lg py-2 px-3 font-mono">
			<div class="top-5 left-0 float-left h-full w-8 select-none text-right text-gray-500">
				{#each Array(data.numberOfLines) as _, i}
					<span class="block">{i + 1}</span>
				{/each}
			</div>

			<div class="relative h-full w-full">
				<div class="code-block !bg-transparent !leading-normal text-white">
					<pre
						class="w-full resize-none whitespace-pre break-all !rounded-none !bg-transparent !py-0 !px-4 !leading-normal text-white"><code
							class="language-{language}"
							>{#if formatted}{@html displayCode}{:else}{cleanPasteContent.trim()}{/if}</code
						></pre>
				</div>
			</div>
		</div>
	</div>
	<!-- Paste Content -->

	<!-- Action Buttons -->
	<div class="my-2 flex h-14 w-full justify-center px-10">
		<a href="/" class="btn-filled-primary btn mx-2 w-full max-w-xs !text-xl text-white"
			><span class="w-full">New</span></a
		>

		<div class="relative">
			<button
				type="button"
				class="btn-filled-accent btn mx-2 h-full text-white"
				use:popup={pasteOptionsSettings}
			>
				<Icon src={ArrowUpS} theme="solid" class="text-white" size="30" />
			</button>
			<nav class="card list-nav w-64 p-4 shadow-xl" data-popup="pasteOptions">
				<ul>
					<li>
						<button
							type="button"
							class="btn w-full !text-left text-white hover:bg-primary-500/10"
							on:click={() => modalStore.trigger(showTitleModal)}
							><span class="w-full">Show Title</span>
						</button>
					</li>
					<li>
						<button
							type="button"
							class="btn w-full !text-left text-white hover:bg-primary-500/10"
							use:clipboard={data.paste.content}
							on:click={handleCopy}
							><span class="w-full">Copy</span>
						</button>
					</li>
					<li>
						<a
							href="/new/{$page.params.slug}"
							class="btn w-full !text-left text-white hover:bg-primary-500/10"
							data-sveltekit-preload-data="off"><span class="w-full px-1">Duplicate & Edit</span></a
						>
					</li>
					<li>
						<a
							href="/view/{$page.params.slug}/raw"
							class="btn w-full !text-left text-white hover:bg-primary-500/10"
							data-sveltekit-preload-data="off"><span class="w-full px-1">Raw</span></a
						>
					</li>
				</ul>
			</nav>
		</div>
	</div>
	<!-- Action Buttons -->
</div>
