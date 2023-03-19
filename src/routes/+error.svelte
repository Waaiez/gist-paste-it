<script>
	import { page } from '$app/stores';
</script>

<div class="flex min-h-screen items-center justify-center py-48">
	<div class="flex flex-col">
		<div class="flex flex-col items-center">
			<div class="text-accent-500 text-7xl font-bold">{$page.status}</div>

			<div class="mt-8 text-center text-sm font-medium md:text-xl lg:text-2xl">
				{$page.error?.message}
			</div>
		</div>
	</div>
</div>
