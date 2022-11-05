<script lang="ts">
	import { uneval } from 'devalue';

	import type { PageData } from './$types';

	export let data: PageData;

	const cleanedValue = uneval(data.paste.content);
	const cleanPasteContent = (0, eval)('(' + cleanedValue + ')');
</script>

<!-- TODO: See how to better implement raw functionality -->
<!-- <pre class="!bg-transparent border-0 focus:ring-0 text-lg min-h-full">{cleanPasteContent}</pre> -->

<pre class="!rounded-none !bg-transparent !p-0 !m-0 !left-0 !top-0 flex">
	{cleanPasteContent.trim()}
</pre>

<!-- {cleanPasteContent} -->
