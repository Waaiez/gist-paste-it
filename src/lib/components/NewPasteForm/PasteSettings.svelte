<script lang="ts">
	import { modalStore, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { storePasteVisibility } from '$lib/stores';

	function onFormSubmit(): void {
		let pasteSettings = {
			visibility: $storePasteVisibility
		};
		$modalStore[0].response(pasteSettings);
		modalStore.close();
	}

	const boxSettings = 'flex flex-col space-y-2';
</script>

<div class="space-y-5">
	<div class={boxSettings}>
		<span class="text-xl">Visibility</span>
		<RadioGroup selected={storePasteVisibility}>
			<RadioItem value="public">Public</RadioItem>
			<RadioItem value="private">Private</RadioItem>
		</RadioGroup>
	</div>

	<footer class="flex justify-end space-x-2'">
		<button class="btn btn-filled-primary" on:click={onFormSubmit}>Save</button>
	</footer>
</div>
