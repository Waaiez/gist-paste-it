import { writable, type Writable } from 'svelte/store';

export const storePasteVisibility: Writable<'public' | 'private'> = writable('public');
