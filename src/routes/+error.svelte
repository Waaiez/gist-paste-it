<script>
	import { page } from '$app/stores';
</script>

<!-- TODO: better error page -->
<h1>{$page.status}: {$page.error?.message}</h1>
