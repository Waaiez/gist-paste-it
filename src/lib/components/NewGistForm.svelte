<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	// @ts-ignore
	import Icon from 'svelte-icons-pack/Icon.svelte';
	// @ts-ignore
	import FaSolidPlus from 'svelte-icons-pack/fa/FaSolidPlus';
	import FaSave from 'svelte-icons-pack/fa/FaSave';

	import { uneval } from 'devalue';
	import LanguageSelectionInput from './LanguageSelection/LanguageSelectionInput.svelte';

	export let existingData: {
		gist: {
			title: string;
			content: string;
		};
	} = { gist: { title: '', content: '' } };

	export let formTitle = '';
	export let formContent = '';

	const dispatch = createEventDispatcher();

	const submit = () => dispatch('submit');

	let textarea: HTMLTextAreaElement;
	let title: HTMLInputElement;

	let isAbleToSubmit = false;

	function addTabs(event: KeyboardEvent) {
		if (event.key === 'Tab') {
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;

			textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end);

			event.preventDefault();
		}
	}

	function clearForm() {
		textarea.value = '';
		title.value = '';
		isAbleToSubmit = false;
	}

	onMount(() => {
		textarea.setSelectionRange(0, 0);
		// textarea.focus();

		textarea.value = '';
		title.value = '';

		const cleanedValue = uneval(existingData.gist.content);
		const cleanGistContent = (0, eval)('(' + cleanedValue + ')');

		textarea.value = cleanGistContent;
		title.value = existingData.gist.title;

		isAbleToSubmit = textarea.value.length > 0 && title.value.length > 0;

		[textarea, title].forEach((element) => {
			['change', 'input'].forEach(function (event) {
				element.addEventListener(event, () => {
					isAbleToSubmit = textarea.value.length > 0 && title.value.length > 0;
				});
			});
		});
	});

	$: formTitle = title?.value ?? '';
	$: formContent = textarea?.value ?? '';
</script>

<div class="h-full w-full flex flex-col py-5">
	<div class="w-full flex justify-center px-10">
		<label for="title" class="w-full flex justify-center">
			<input
				type="text"
				id="title"
				name="title"
				bind:this={title}
				minlength="2"
				maxlength="255"
				autocomplete="off"
				required
				placeholder="Enter a title"
				class="rounded-lg w-full max-w-md text-lg"
			/>
		</label>
	</div>

	<!-- TODO: Add language selection
	<div class="h-full relative pt-5 pl-12 font-mono">
		<div class="absolute top-5 left-0 w-8 text-right text-lg select-none">&gt;</div>

		<textarea
			id="content"
			name="content"
			spellcheck="false"
			class="!bg-transparent border-0 p-1 w-full h-full outline-none resize-none my-0 focus:ring-0 text-lg leading-5 scrollbar-thin"
			bind:this={textarea}
			on:keydown={addTabs}
		/>
	</div> -->

	<div class="mb-2 w-full rounded-lg md:px-10 h-full flex flex-col">
		<div class="flex justify-between items-center py-2 px-3 border-b border-gray-500">
			<div class="flex flex-wrap items-center">
				<div class="flex items-center space-x-1 sm:pr-4">
					<!-- TODO: add language here -->
					<LanguageSelectionInput />
				</div>
			</div>
		</div>
		<div class="flex flex-grow items-center py-2 px-3 rounded-lg font-mono">
			<div class="h-full top-5 left-0 w-8 text-right select-none float-left">&gt;</div>

			<textarea
				id="content"
				name="content"
				class="!bg-transparent border-0 outline-none resize-none focus:ring-0 text-lg !leading-normal -my-10 !py-0 !px-4 min-h-full overflow-x-auto !whitespace-pre"
				spellcheck="false"
				bind:this={textarea}
				on:keydown={addTabs}
			/>
		</div>
	</div>

	<div class="w-full h-14 flex justify-center px-10">
		<button
			type="submit"
			class="w-full max-w-xs bg-primary-500 btn btn-sm text-white rounded-lg text-lg mx-2"
			disabled={!isAbleToSubmit}
			on:click={submit}
		>
			<span> Create </span>
		</button>
		<button
			type="button"
			class=" bg-accent-500 btn btn-sm text-white rounded-lg text-lg mx-2"
			on:click={clearForm}
		>
			<Icon src={FaSolidPlus} color="white" size="20" />
		</button>
	</div>
</div>
