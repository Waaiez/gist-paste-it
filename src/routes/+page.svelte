<script lang="ts">
	import NewPasteForm from '$lib/components/NewPasteForm.svelte';
	import { toastStore, type ToastSettings } from '@brainandbones/skeleton';
	import type { ActionData } from './$types';

	export let form: ActionData;

	function triggerToast(message: string) {
		const toastMessage: ToastSettings = {
			message,
			classes: 'bg-warning-500'
		};
		toastStore.trigger(toastMessage);
	}

	$: form?.invalid && triggerToast(form?.message);
</script>

<form method="POST" class="h-full">
	<NewPasteForm />
</form>
