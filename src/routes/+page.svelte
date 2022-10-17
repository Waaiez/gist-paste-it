<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-ignore
	import Icon from 'svelte-icons-pack/Icon.svelte';
	// @ts-ignore
	import FaSolidPlus from 'svelte-icons-pack/fa/FaSolidPlus';
	import FaSave from 'svelte-icons-pack/fa/FaSave';

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
		textarea.focus();
		textarea.value = '';
		title.value = '';

		isAbleToSubmit = textarea.value.length > 0 && title.value.length > 0;

		textarea.addEventListener('change', () => {
			isAbleToSubmit = textarea.value.length > 0 && title.value.length > 0;
		});
		textarea.addEventListener('input', () => {
			isAbleToSubmit = textarea.value.length > 0 && title.value.length > 0;
		});
		title.addEventListener('change', () => {
			isAbleToSubmit = textarea.value.length > 0 && title.value.length > 0;
		});
		title.addEventListener('input', () => {
			isAbleToSubmit = textarea.value.length > 0 && title.value.length > 0;
		});
	});
</script>

<form method="POST" class="h-full">
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
			<!-- TODO: Add language selection -->
		</div>
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
		</div>
		<div class="w-full h-14 flex justify-center px-10">
			<button
				type="submit"
				class="w-full max-w-xs bg-primary-500 btn btn-sm text-white rounded-lg text-lg mx-2"
				disabled={!isAbleToSubmit}
			>
				<span>
					<Icon src={FaSave} color="white" />
				</span>
				<span> Create </span>
			</button>
			<button
				type="button"
				class=" bg-accent-500 btn btn-sm text-white rounded-lg text-lg mx-2"
				on:click={clearForm}
			>
				<Icon src={FaSolidPlus} color="white" />
			</button>
		</div>
	</div>
</form>
