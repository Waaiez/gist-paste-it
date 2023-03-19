<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	import { Add, Eye, EyeOff, Loader, Settings2 } from '@steeze-ui/remix-icons';
	import { Icon } from '@steeze-ui/svelte-icon';

	import { uneval } from 'devalue';

	import {
		focusTrap,
		modalStore,
		popup,
		toastStore,
		type ModalComponent,
		type ModalSettings,
		type PopupSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';

	import LanguageSelectionInput from './LanguageSelection/LanguageSelectionInput.svelte';
	import PasteSettings from './PasteSettings.svelte';

	import { goto } from '$app/navigation';
	import { storePasteVisibility } from '$lib/stores';

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

	let newFormToolTip: PopupSettings = {
		event: 'hover',
		target: 'newFormToolTip'
	};

	function newForm() {
		textarea.value = '';
		title.value = '';
		isAbleToSubmit = false;
	}

	function openPasteSettings() {
		interface PasteSettingsResponse {
			visibility: string;
		}

		const modalComponent: ModalComponent = {
			ref: PasteSettings
		};

		const modalSettings: ModalSettings = {
			type: 'component',
			component: modalComponent,
			title: 'Paste Settings',
			response: (response: PasteSettingsResponse) => {
				if (response) console.log('response:', response);
			}
		};

		modalStore.trigger(modalSettings);
	}

	function addTabs(event: KeyboardEvent) {
		if (event.key === 'Tab') {
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;

			textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end);

			event.preventDefault();
		}
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
					background: 'variant-filled-error'
				};
				toastStore.trigger(toastMessage);
				isSubmitting = false;
			}
		} catch (e) {
			const toastMessage: ToastSettings = {
				message: 'Something went wrong trying to create your paste, please try again later',
				background: 'variant-filled-error'
			};
			toastStore.trigger(toastMessage);
			isSubmitting = false;
		}
	}

	let pasteVisibillityPopup: PopupSettings = {
		event: 'hover',
		target: 'pasteVisibillityPopup'
	};
</script>

<form
	on:submit|preventDefault={onSubmit}
	class="flex h-full w-full flex-col py-2"
	use:focusTrap={true}
>
	<label for="title" class="label flex w-full justify-end pl-10 pr-2 md:justify-center">
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
			class="input w-full max-w-md rounded-lg text-lg"
		/>
	</label>

	<div class="flex h-full w-full flex-col rounded-lg md:px-10">
		<div class="flex items-center justify-between border-b border-gray-500 py-2 px-4">
			<div class="flex flex-wrap items-center">
				<div class="flex items-center space-x-1 sm:pr-4">
					<LanguageSelectionInput />
				</div>
				<div use:popup={pasteVisibillityPopup}>
					{#if $storePasteVisibility === 'private'}
						<Icon src={EyeOff} class="text-white" size="25" />
					{:else if $storePasteVisibility === 'public'}
						<Icon src={Eye} class="text-white" size="25" />
					{/if}
				</div>
				<div
					class="card variant-filled-secondary whitespace-nowrap p-2 text-center text-xs shadow-xl"
					data-popup="pasteVisibillityPopup"
				>
					Paste will be {$storePasteVisibility}
					<div class="arrow variant-filled-secondary" />
				</div>
			</div>

			<div class="btn-icon">
				<button type="button" class=" -mr-5 h-full" on:click={openPasteSettings}>
					<Icon src={Settings2} class="text-white" size="25" />
				</button>
			</div>

			<input type="hidden" id="visibility" name="visibility" value={$storePasteVisibility} />
		</div>

		<div class="flex flex-grow items-center rounded-lg py-2 font-mono">
			<div class="top-5 left-0 float-left h-full w-8 select-none text-center">&gt;</div>

			<textarea
				id="content"
				name="content"
				class="textarea -my-10 min-h-full resize-none overflow-x-auto !whitespace-pre border-0 !bg-transparent !py-0 !px-4 text-lg !leading-normal outline-none focus:ring-0"
				spellcheck="false"
				minlength="1"
				bind:this={textarea}
				on:keydown={addTabs}
				placeholder="Paste your text here..."
			/>
		</div>
	</div>

	<div class="flex h-14 w-full justify-center px-10">
		<button
			type="submit"
			class="btn variant-filled-primary mx-2 w-full max-w-xs !py-4 !text-xl text-white"
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
			class="btn variant-filled-secondary mx-2 h-full"
			on:click={newForm}
			use:popup={newFormToolTip}
		>
			<Icon src={Add} theme="solid" class="" size="25" />
		</button>
		<div
			class="card variant-filled-secondary whitespace-nowrap p-2 text-center text-xs shadow-xl"
			data-popup="newFormToolTip"
		>
			New Form
			<div class="arrow variant-filled-secondary" />
		</div>
	</div>
</form>
