<script>
	import '@brainandbones/skeleton/themes/theme-skeleton.css';
	import '@brainandbones/skeleton/styles/all.css';
	import '../app.css';
	import { Toast } from '@brainandbones/skeleton';
</script>

<svelte:head>
	<title>Pasterr</title>
	<meta name="description" content="Pasterr" />
</svelte:head>

<Toast background="bg-accent-500" position="tr" duration={500} />

<main class="h-screen scrollbar-thin">
	<slot />
</main>
