# Gist Paste It

This is a project similar to [Gist](https://gist.github.com/) and [Hastebin](https://hastebin.com) created using [SvelteKit](https://kit.svelte.dev/).

## Technologies used:

- [SvelteKit](https://kit.svelte.dev/)
- [Svelte](https://svelte.dev/)
- [Skeleton](https://www.skeleton.dev)
- [Tailwind](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [CockroachDB](https://www.cockroachlabs.com/)
- [Vercel](https://vercel.com/)

## Features:

- [x] Create A Gist
- [x] View A Gist
- [x] View A Gist As Raw (Plain Text)
- [x] Copy A Gist
- [x] Duplicate & Edit Existing Gists
- [x] Gist View Count
- [x] Language Support (Syntax Highlighting)

## Future Plans:

- Page to view latest gists
- Allowing gists to be private (IE: Wont show up in latest gists)
- Allow gists to be password protected
- Allow gists to have timer to delete after a certain amount of time
- Allowing gists to be viewed once before being deleted
- og:image for sharing on social media
- media uploads

## Things to think about:

- Do I want accounts?
  - Do I want to allow users to edit their gists?
    - Do I want to allow users to delete their gists?
- Possibly allow user to choose slug length / custom slug
- View count logic is probably wrong, do research

## Considerations:

- No rate limiting
- Prisma apparently uses prepared statements, but I'm not sure if that's enough to prevent SQL injection attacks

## TODO:

- Look at TODO comments
- Change all occurrences of Gist to Paste

https://www.npmjs.com/package/highlight.js?activeTab=readme#nodejs-on-the-server
https://github.com/AlexxNB/highlightjs-svelte
