<script lang="ts">
	import NewPasteForm from '$lib/components/NewPasteForm.svelte';
	import { toastStore, type ToastMessage } from '@brainandbones/skeleton';
	import type { ActionData } from './$types';

	export let form: ActionData;

	// TODO: Change colour of toast when Skeleton supports it
	function triggerToast(message: string) {
		const toastMessage: ToastMessage = {
			message
		};
		toastStore.trigger(toastMessage);
	}

	$: form?.invalid && triggerToast(form?.message);
</script>

<form method="POST" class="h-full">
	<NewPasteForm />
</form>
