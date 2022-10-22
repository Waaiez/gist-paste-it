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

- [x] Create a gist
- [x] View a gist
- [x] View a gist as raw (plain text)
- [x] Copy a gist
- [x] Duplicate & Edit existing gists

## Future Plans:

- Add Language Support (Syntax Highlighting)
- Page to view latest gists
- Allowing gists to be private (IE: Wont show up in latest gists)
- Allow gists to be password protected
- Allow gists to have timer to delete after a certain amount of time
- Allowing gists to be viewed once before being deleted
- Better error page

## Things to think about:

- Do I want accounts?
  - Do I want to allow users to edit their gists?
    - Do I want to allow users to delete their gists?
- Possibly allow user to choose slug length / custom slug

## Considerations:

- No rate limiting
- Prisma apparently uses prepared statements, but I'm not sure if that's enough to prevent SQL injection attacks

## TODO:

- Look at TODO comments
- Think about how to minimize duplicate code (i.e the code for fetching a gist)
