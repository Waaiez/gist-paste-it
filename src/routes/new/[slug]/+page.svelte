<script lang="ts">
	import NewPasteForm from '$lib/components/NewPasteForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<NewPasteForm existingData={data} />
