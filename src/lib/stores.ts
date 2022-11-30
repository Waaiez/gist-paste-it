import { writable, type Writable } from 'svelte/store';

export const storeDrawer: Writable<boolean> = writable(false);

export const storePasteVisibility: Writable<'public' | 'private'> = writable('public');
