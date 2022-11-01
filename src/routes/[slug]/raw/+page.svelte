<script lang="ts">
	import { uneval } from 'devalue';

	import type { PageData } from './$types';

	export let data: PageData;

	const cleanedValue = uneval(data.gist.content);
	const cleanGistContent = (0, eval)('(' + cleanedValue + ')');
</script>

<!-- TODO: See how to better implement raw functionality -->
<!-- <pre class="!bg-transparent border-0 focus:ring-0 text-lg min-h-full">{cleanGistContent}</pre> -->
{cleanGistContent}
