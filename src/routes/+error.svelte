<script>
	import { page } from '$app/stores';
</script>

<div class="flex min-h-screen items-center justify-center py-48">
	<div class="flex flex-col">
		<div class="flex flex-col items-center">
			<div class="text-7xl font-bold text-accent-500">{$page.status}</div>

			<div class="mt-8 text-sm font-medium md:text-xl lg:text-2xl text-center">
				{$page.error?.message}
			</div>
		</div>
	</div>
</div>
