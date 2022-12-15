// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare module 'highlightjs-svelte';

declare namespace App {
	interface Error {
		message: string;
		stack?: unknown;
	}
}
