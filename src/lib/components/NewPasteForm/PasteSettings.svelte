<script lang="ts">
	import { storePasteVisibility } from '$lib/stores';
	import { modalStore, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	let visibility = $storePasteVisibility;

	function onFormSubmit(): void {
		storePasteVisibility.set(visibility);

		modalStore.close();
	}
</script>

<div class="card w-modal space-y-5 p-4 shadow-xl">
	<div class="flex flex-col space-y-2">
		<span class="text-center text-2xl font-bold md:text-left">Visibility</span>

		<RadioGroup display="flex flex-col md:flex-row space-y-2 md:space-y-0">
			<RadioItem
				bind:group={visibility}
				name="pasteVisibility"
				value="public"
				active="variant-filled-primary"
				hover="hover:variant-soft-primary">Public</RadioItem
			>
			<RadioItem
				bind:group={visibility}
				name="pasteVisibility"
				value="private"
				active="variant-filled-primary"
				hover="hover:variant-soft-primary">Private</RadioItem
			>
		</RadioGroup>
	</div>

	<footer class="space-x-2' flex justify-end">
		<button class="btn variant-filled-primary" on:click={onFormSubmit}>Save</button>
	</footer>
</div>
