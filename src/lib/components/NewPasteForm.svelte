<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Plus } from '@steeze-ui/heroicons';

	import { uneval } from 'devalue';
	import LanguageSelectionInput from './LanguageSelection/LanguageSelectionInput.svelte';

	import { focusTrap } from '@brainandbones/skeleton';

	export let existingData: {
		paste: {
			title: string;
			content: string;
		};
	} = { paste: { title: '', content: '' } };

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

		const cleanedValue = uneval(existingData.paste.content);
		const cleanPasteContent = (0, eval)('(' + cleanedValue + ')');

		textarea.value = cleanPasteContent;
		title.value = existingData.paste.title;

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

<div class="h-full w-full flex flex-col py-2" use:focusTrap={true}>
	<!-- Title Input -->
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
	<!-- Title Input -->

	<!-- Language Selection & Paste Input -->
	<div class="mb-2 w-full rounded-lg md:px-10 h-full flex flex-col">
		<!-- Language Selection -->
		<div class="flex justify-between items-center py-2 px-3 border-b border-gray-500">
			<div class="flex flex-wrap items-center">
				<div class="flex items-center space-x-1 sm:pr-4">
					<LanguageSelectionInput />
				</div>
			</div>
		</div>
		<!-- Language Selection -->

		<!-- Paste Input -->
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
		<!-- Paste Input -->
	</div>
	<!-- Language Selection & Paste Input -->

	<!-- Action Buttons -->
	<div class="w-full h-14 flex justify-center px-10">
		<button
			type="submit"
			class="w-full max-w-xs btn-filled-primary btn  text-white rounded-lg !text-xl mx-2 !py-4"
			disabled={!isAbleToSubmit}
			on:click={submit}
		>
			<span> Create </span>
		</button>
		<button type="button" class="btn btn-filled-accent mx-2" on:click={clearForm}>
			<Icon src={Plus} theme="solid" class="text-white" size="25" />
		</button>
	</div>
	<!-- Action Buttons -->
</div>
