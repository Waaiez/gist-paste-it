<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';

	import { Icon } from '@steeze-ui/svelte-icon';
	import { Add, Loader, Settings2 } from '@steeze-ui/remix-icons';

	import { uneval } from 'devalue';

	import {
		focusTrap,
		modalStore,
		toastStore,
		tooltip,
		type ModalComponent,
		type ModalSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';

	import PasteSettings from './PasteSettings.svelte';
	import LanguageSelectionInput from './LanguageSelection/LanguageSelectionInput.svelte';

	import { storePasteVisibility } from '$lib/stores';
	import { goto } from '$app/navigation';

	interface ExistingPasteData {
		paste: {
			title: string;
			content: string;
		};
	}

	export let existingData: ExistingPasteData = { paste: { title: '', content: '' } };

	const dispatch = createEventDispatcher();

	let textarea: HTMLTextAreaElement;
	let title: HTMLInputElement;

	let isAbleToSubmit = false;
	let isSubmitting = false;

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

	function openPasteSettings() {
		interface PasteSettings {
			visibility: string;
		}

		const modalComponent: ModalComponent = {
			ref: PasteSettings
		};

		const modalSettings: ModalSettings = {
			type: 'component',
			title: 'Paste Settings',
			component: modalComponent,
			response: (response: PasteSettings) => {
				if (response) console.log('response:', response);
			}
		};

		modalStore.trigger(modalSettings);
	}

	async function onSubmit(e: SubmitEvent) {
		try {
			isSubmitting = true;

			const formData = new FormData(e.target as HTMLFormElement);

			let pasteData = Object.fromEntries(formData);

			const response = await fetch('/api/pastes/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(pasteData)
			});

			type CreateResponseData = {
				success: boolean;
				message: string;
				slug: string;
				redirect: string;
			};

			const data: CreateResponseData = await response.json();

			if (data.success) {
				isSubmitting = false;
				goto(data.redirect);
			} else {
				const toastMessage: ToastSettings = {
					message: data.message,
					classes: 'bg-warning-500'
				};
				toastStore.trigger(toastMessage);
				isSubmitting = false;
			}
		} catch (e) {
			const toastMessage: ToastSettings = {
				message: 'Something went wrong trying to create your paste, please try again later',
				classes: 'bg-warning-500'
			};
			toastStore.trigger(toastMessage);
			isSubmitting = false;
		}
	}
</script>

<form on:submit|preventDefault={onSubmit} class="h-full">
	<div class="h-full w-full flex flex-col py-2" use:focusTrap={true}>
		<div class="w-full flex justify-center px-10">
			<label for="title" class="w-full flex justify-center">
				<input
					type="text"
					id="title"
					name="title"
					bind:this={title}
					minlength="1"
					maxlength="255"
					autocomplete="off"
					required
					placeholder="Enter a title"
					class="rounded-lg w-full max-w-md text-lg caret-white"
				/>
			</label>
		</div>

		<div class="mb-2 w-full rounded-lg md:px-10 h-full flex flex-col">
			<div class="flex justify-between items-center py-2 px-3 border-b border-gray-500">
				<div class="flex flex-wrap items-center">
					<div class="flex items-center space-x-1 sm:pr-4">
						<LanguageSelectionInput />
					</div>
				</div>

				<button type="button" class="btn mx-2 h-full" on:click={openPasteSettings}>
					<Icon src={Settings2} class="text-white" size="25" />
				</button>
			</div>

			<div class="flex flex-grow items-center py-2 px-3 rounded-lg font-mono">
				<div class="h-full top-5 left-0 w-8 text-right select-none float-left">&gt;</div>

				<textarea
					id="content"
					name="content"
					class="!bg-transparent border-0 outline-none resize-none focus:ring-0 text-lg !leading-normal -my-10 !py-0 !px-4 min-h-full overflow-x-auto !whitespace-pre caret-white"
					spellcheck="false"
					minlength="1"
					bind:this={textarea}
					on:keydown={addTabs}
					placeholder="Paste your text here..."
				/>
			</div>
		</div>

		<input type="hidden" id="visibility" name="visibility" value={$storePasteVisibility} />

		<div class="w-full h-14 flex justify-center px-10">
			<button
				type="submit"
				class="w-full max-w-xs btn-filled-primary btn  text-white !text-xl mx-2 !py-4"
				disabled={!isAbleToSubmit || isSubmitting}
				on:click={() => dispatch('submit')}
			>
				{#if isSubmitting}
					<Icon src={Loader} class="animate-spin text-white" size="24" />
				{:else}
					<span> Create </span>
				{/if}
			</button>
			<button
				type="button"
				class="btn btn-filled-accent mx-2 h-full"
				on:click={clearForm}
				use:tooltip={{ content: 'Clear Form', background: '!bg-accent-500' }}
			>
				<Icon src={Add} theme="solid" class="text-white" size="25" />
			</button>
		</div>
	</div>
</form>
