<script>
	import '@brainandbones/skeleton/themes/theme-skeleton.css';
	import '@brainandbones/skeleton/styles/all.css';
	import '../app.css';
	import { Toast } from '@brainandbones/skeleton';
</script>

<svelte:head>
	<title>Gist Paste It</title>
	<meta name="description" content="Gist Paste It" />
</svelte:head>

<Toast background="bg-accent-500" position="tr" variant="filled" duration={500} />

<main class="h-screen scrollbar-thin">
	<slot />
</main>
